'use strict';
const WINNING_SCORE = 20;
const RESET_SCORE = [1, 6];

let currentScore;
let score = [0, 0];
let isFirstPlayerPlaying = true;
let activePlayer = 0;

const dice = document.querySelector('.dice-image');
const player0Section = document.querySelector('.player--0');
const player1Section = document.querySelector('.player--1');
const diceRollButton = document.querySelector('.btn--roll');
const holdButton = document.querySelector('.btn--hold');

function init() {
  score = [0, 0];
  currentScore = 0;
  document
    .querySelectorAll('.score')
    .forEach((scoreEl, index) => (scoreEl.textContent = score[index]));
  document
    .querySelectorAll('.current-score')
    .forEach(currentScoreEl => (currentScoreEl.textContent = currentScore));
  player1Section.classList.remove('player--active');
  player1Section.classList.remove('player--winner');
  player0Section.classList.add('player--active');
  player0Section.classList.remove('player--winner');
  activePlayer = 0;
  dice.classList.add('hidden');
  diceRollButton.classList.remove('hidden');
  holdButton.classList.remove('hidden');
}

function changeTurn() {
  currentScore = 0;
  document
    .querySelectorAll('.player')
    .forEach(player => player.classList.toggle('player--active'));
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
  activePlayer = activePlayer === 0 ? 1 : 0;
}

function handleDiceRoll() {
  diceRollButton.disabled = true;
  dice.classList.remove('hidden');
  dice.classList.add('spin');
  const randomNumber = Math.floor(Math.random() * 6) + 1;

  setTimeout(() => {
    dice.src = `dice-${randomNumber}.png`;
  }, 500);

  setTimeout(() => {
    if (RESET_SCORE.includes(randomNumber)) {
      changeTurn();
      dice.classList.remove('spin');
      dice.classList.add('hidden');
      diceRollButton.disabled = false;
      return;
    }
    currentScore += randomNumber;
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore;

    dice.classList.remove('spin');
    dice.classList.add('hidden');
    diceRollButton.disabled = false;
  }, 2000);
}

function handleHold() {
  score[activePlayer] += currentScore;
  document.getElementById(`score--${activePlayer}`).textContent =
    score[activePlayer];
  if (score[activePlayer] >= WINNING_SCORE) {
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add('player--winner');
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    diceRollButton.classList.add('hidden');
    holdButton.classList.add('hidden');
  } else {
    changeTurn();
  }
}

diceRollButton.addEventListener('click', handleDiceRoll);
holdButton.addEventListener('click', handleHold);
document.querySelector('.btn--new').addEventListener('click', init);

// initializing the game
init();

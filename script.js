'use strict';
const WINNING_SCORE = 20;
const RESET_SCORE = [1, 6];

let playerNames = ['Player 1', 'Player 2'];
let currentScore;
let score = [0, 0];
let isFirstPlayerPlaying = true;
let activePlayer = 0;

const dice = document.querySelector('.dice-image');
const player0Section = document.querySelector('.player--0');
const player1Section = document.querySelector('.player--1');
const diceRollButton = document.querySelector('.btn--roll');
const holdButton = document.querySelector('.btn--hold');

const formData = `
      <form class="register-form">
        <div class="description">
          <h2 class="modal-title">Welcome to Pig Dice Game!</h2>
          <h3>Rules</h3>
          <ul>
            <li>Each player takes turns rolling a die.</li>
            <li>Players can accumulate their scores.</li>
            <li>Cursed Numbers: ${RESET_SCORE.join(
              ', '
            )} - If a player rolls a cursed number, they lose their current score, and the next player takes their turn.</li>
            <li>Players can choose to hold their score, securing it but giving the next player a chance to roll.</li>
            <li>The first player to reach ${WINNING_SCORE} wins.</li>
          </ul>
        </div>
        
        <h4>Please enter your names for each player.</h4>

        <div class="modal-inputs">
          <input
            type="text"
            name="player-name--0"
            placeholder="Enter Player 1 name"
            required
          />
          <input
            type="text"
            name="player-name--1"
            placeholder="Enter Player 2 name"
            required
          />
        </div>

        <div class="modal-buttons">
          <button class="modal-btn btn--skip" type="button">Skip</button>
          <button class="modal-btn btn--save" type="submit">Save</button>
        </div>
      </form>`;

function init() {
  score = [0, 0];
  playerNames = ['Player 1', 'Player 2'];
  currentScore = 0;
  document.querySelectorAll('.name').forEach((nameEl, index) => {
    nameEl.textContent = playerNames[index];
  });
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
  showModal(formData);
  document
    .querySelector('.register-form')
    .addEventListener('submit', handleSubmit);
  document.querySelector('.btn--skip').addEventListener('click', handleSkip);
}

function hideModal() {
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.overlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function showModal(content) {
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.modal').innerHTML = content;

  document.body.style.overflow = 'hidden';
}

function handleSubmit(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');
  inputs.forEach((input, index) => {
    playerNames[index] = input.value;
    document.getElementById(`name--${index}`).textContent = playerNames[index];
  });
  hideModal();
}

function handleSkip() {
  hideModal();
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

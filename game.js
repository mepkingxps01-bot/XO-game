const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const cells      = document.querySelectorAll('.cell');
const statusEl   = document.getElementById('status');
const overlay    = document.getElementById('overlay');
const resultIcon = document.getElementById('result-icon');
const resultText = document.getElementById('result-text');
const xScoreEl   = document.getElementById('x-score');
const oScoreEl   = document.getElementById('o-score');
const drawScoreEl= document.getElementById('draw-score');
const scoreCardX = document.getElementById('score-x');
const scoreCardO = document.getElementById('score-o');

let board, currentPlayer, gameOver, scores;

function init() {
  board         = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver      = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.setAttribute('data-mark', '');
    cell.className = 'cell';
  });

  scores = scores ?? { X: 0, O: 0, draw: 0 };
  updateStatus();
  updateScoreHighlight();
}

function updateStatus() {
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
}

function updateScoreHighlight() {
  scoreCardX.classList.toggle('active-x', currentPlayer === 'X');
  scoreCardO.classList.toggle('active-o', currentPlayer === 'O');
}

function handleClick(e) {
  const idx = +e.currentTarget.dataset.index;
  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  const cell = cells[idx];
  cell.setAttribute('data-mark', currentPlayer);
  cell.classList.add('taken', currentPlayer.toLowerCase());

  const winCombo = checkWin();
  if (winCombo) {
    endGame('win', winCombo);
  } else if (board.every(Boolean)) {
    endGame('draw');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
    updateScoreHighlight();
  }
}

function checkWin() {
  return WINNING_COMBOS.find(combo =>
    combo.every(i => board[i] === currentPlayer)
  ) ?? null;
}

function endGame(result, winCombo = []) {
  gameOver = true;

  if (result === 'win') {
    winCombo.forEach(i => cells[i].classList.add('winner'));
    scores[currentPlayer]++;
    xScoreEl.textContent   = scores.X;
    oScoreEl.textContent   = scores.O;
    resultIcon.textContent = currentPlayer === 'X' ? '🟣' : '🔵';
    resultText.textContent = `Player ${currentPlayer} Wins!`;
    statusEl.textContent   = `Player ${currentPlayer} wins!`;
  } else {
    scores.draw++;
    drawScoreEl.textContent = scores.draw;
    resultIcon.textContent  = '🤝';
    resultText.textContent  = "It's a Draw!";
    statusEl.textContent    = "It's a draw!";
  }

  setTimeout(() => overlay.classList.remove('hidden'), 600);
}

function newGame() {
  overlay.classList.add('hidden');
  init();
}

function resetScores() {
  scores = { X: 0, O: 0, draw: 0 };
  xScoreEl.textContent    = 0;
  oScoreEl.textContent    = 0;
  drawScoreEl.textContent = 0;
  newGame();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
document.getElementById('restart-btn').addEventListener('click', newGame);
document.getElementById('reset-btn').addEventListener('click', resetScores);
document.getElementById('play-again-btn').addEventListener('click', newGame);

init();

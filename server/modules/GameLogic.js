
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]             
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (isBoardFull(board)) {
    return 'draw';
  }

  return null;
}

function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

function isValidMove(board, position) {
  return position >= 0 && position <= 8 && board[position] === null;
}

module.exports = {
  checkWinner,
  isBoardFull,
  isValidMove
};

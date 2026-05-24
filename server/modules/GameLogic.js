/**
 * GameLogic.js
 * Regras puras do Jogo da Velha.
 */

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
  [0, 4, 8], [2, 4, 6]             // Diagonais
];

/**
 * Verifica se há um vencedor ou empate.
 * @param {Array} board Tabuleiro atual (9 posições).
 * @returns {string|null} 'X', 'O', 'draw' ou null.
 */
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

/**
 * Verifica se o tabuleiro está cheio.
 * @param {Array} board Tabuleiro atual.
 * @returns {boolean}
 */
function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

/**
 * Valida se uma jogada é possível.
 * @param {Array} board Tabuleiro atual.
 * @param {number} position Posição desejada (0-8).
 * @returns {boolean}
 */
function isValidMove(board, position) {
  return position >= 0 && position <= 8 && board[position] === null;
}

module.exports = {
  checkWinner,
  isBoardFull,
  isValidMove
};

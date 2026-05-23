const { checkWinner, isValidMove } = require('./GameLogic');

/**
 * GameManager.js
 * Gerencia o estado de uma partida ativa.
 */
class GameManager {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentTurn = 'X'; // X sempre começa
    this.players = {
      'X': null,
      'O': null
    };
    this.status = 'waiting'; // waiting, playing, finished
    this.winner = null;
  }

  /**
   * Associa um jogador a um símbolo.
   * @param {string} playerId ID único do socket.
   * @returns {string|null} Símbolo atribuído ('X' ou 'O').
   */
  addPlayer(playerId) {
    if (!this.players['X']) {
      this.players['X'] = playerId;
      return 'X';
    } else if (!this.players['O']) {
      this.players['O'] = playerId;
      this.status = 'playing';
      return 'O';
    }
    return null; // Partida cheia
  }

  /**
   * Executa uma jogada.
   * @param {string} playerId ID do jogador.
   * @param {number} position Posição (0-8).
   * @returns {Object} Resultado da jogada.
   */
  makeMove(playerId, position) {
    if (this.status !== 'playing') {
      return { success: false, message: 'Partida não iniciada ou já finalizada.' };
    }

    const symbol = this.getPlayerSymbol(playerId);
    if (!symbol || symbol !== this.currentTurn) {
      return { success: false, message: 'Não é o seu turno.' };
    }

    if (!isValidMove(this.board, position)) {
      return { success: false, message: 'Jogada inválida.' };
    }

    this.board[position] = symbol;
    this.winner = checkWinner(this.board);

    if (this.winner) {
      this.status = 'finished';
    } else {
      this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
    }

    return { success: true, board: this.board, currentTurn: this.currentTurn, winner: this.winner };
  }

  getPlayerSymbol(playerId) {
    if (this.players['X'] === playerId) return 'X';
    if (this.players['O'] === playerId) return 'O';
    return null;
  }

  isFull() {
    return this.players['X'] && this.players['O'];
  }
}

module.exports = GameManager;

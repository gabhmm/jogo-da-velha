const { checkWinner, isValidMove } = require('./GameLogic');

class GameManager {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentTurn = 'X'; 
    this.players = {
      'X': null,
      'O': null
    };
    this.playerNames = {
      'X': null,
      'O': null
    };
    this.status = 'waiting'; 
    this.winner = null;
  }

  addPlayer(playerId, playerName) {
    if (!this.players['X']) {
      this.players['X'] = playerId;
      this.playerNames['X'] = playerName;
      return 'X';
    } else if (!this.players['O']) {
      this.players['O'] = playerId;
      this.playerNames['O'] = playerName;
      this.status = 'playing';
      return 'O';
    }
    return null; 
  }

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

  resetForRematch() {
    this.board = Array(9).fill(null);
    this.currentTurn = 'X';
    this.status = 'playing';
    this.winner = null;
  }
}

module.exports = GameManager;

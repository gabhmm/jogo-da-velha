const GameManager = require('./GameManager');

/**
 * RoomManager.js
 * Gerencia as salas de jogo em memória.
 */
class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> GameManager
  }

  /**
   * Cria uma nova sala com um ID único de 6 caracteres.
   * @returns {string} O ID da sala criada.
   */
  createRoom() {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    if (this.rooms.has(roomId)) {
      return this.createRoom(); // Recursão em caso de colisão rara
    }
    this.rooms.set(roomId, new GameManager());
    return roomId;
  }

  /**
   * Adiciona um jogador a uma sala.
   * @param {string} roomId
   * @param {string} playerId
   * @returns {Object|null} { symbol, game } ou null se a sala não existir ou estiver cheia.
   */
  joinRoom(roomId, playerId) {
    const game = this.rooms.get(roomId);
    if (!game) return null;

    const symbol = game.addPlayer(playerId);
    if (!symbol) return null;

    return { symbol, game };
  }

  /**
   * Obtém a instância de jogo de uma sala.
   * @param {string} roomId
   * @returns {GameManager|null}
   */
  getGame(roomId) {
    return this.rooms.get(roomId) || null;
  }

  /**
   * Remove uma sala.
   * @param {string} roomId
   */
  removeRoom(roomId) {
    this.rooms.delete(roomId);
  }

  /**
   * Encontra e limpa salas onde um jogador se desconectou.
   * @param {string} playerId
   * @returns {string|null} roomId da sala afetada.
   */
  handleDisconnect(playerId) {
    for (const [roomId, game] of this.rooms.entries()) {
      if (game.players['X'] === playerId || game.players['O'] === playerId) {
        // Por simplicidade, removemos a sala se alguém sair.
        // Em um sistema real, poderíamos notificar o outro jogador primeiro.
        this.removeRoom(roomId);
        return roomId;
      }
    }
    return null;
  }
}

module.exports = new RoomManager(); // Singleton

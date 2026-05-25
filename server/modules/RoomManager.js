const GameManager = require('./GameManager');

class RoomManager {
  constructor() {
    this.rooms = new Map(); 
  }

  createRoom(playerId, playerName) {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    if (this.rooms.has(roomId)) {
      return this.createRoom(playerId, playerName); 
    }
    const game = new GameManager();
    game.addPlayer(playerId, playerName);
    this.rooms.set(roomId, game);
    return roomId;
  }

  joinRoom(roomId, playerId, playerName) {
    const game = this.rooms.get(roomId);
    if (!game) return null;

    const symbol = game.addPlayer(playerId, playerName);
    if (!symbol) return null;

    return { symbol, game };
  }

  getGame(roomId) {
    return this.rooms.get(roomId) || null;
  }

  removeRoom(roomId) {
    this.rooms.delete(roomId);
  }

  handleDisconnect(playerId) {
    for (const [roomId, game] of this.rooms.entries()) {
      if (game.players['X'] === playerId || game.players['O'] === playerId) {
        this.removeRoom(roomId);
        return roomId;
      }
    }
    return null;
  }
}

module.exports = new RoomManager(); 

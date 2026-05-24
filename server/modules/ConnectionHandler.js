const RoomManager = require('./RoomManager');

/**
 * ConnectionHandler.js
 * Roteia as mensagens WebSocket para as ações correspondentes.
 */
class ConnectionHandler {
  /**
   * Trata uma nova conexão e as mensagens recebidas.
   * @param {WebSocket} ws Instância do WebSocket.
   * @param {WebSocketServer} wss Instância do servidor para broadcast.
   */
  handle(ws, wss) {
    const playerId = ws.id;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        this.route(ws, wss, data);
      } catch (err) {
        this.sendError(ws, 'Mensagem inválida. Formato JSON esperado.');
      }
    });

    ws.on('close', () => {
      const affectedRoomId = RoomManager.handleDisconnect(playerId);
      if (affectedRoomId) {
        this.broadcastToRoom(wss, affectedRoomId, { type: 'OPPONENT_LEFT' });
      }
    });
  }

  /**
   * Roteia a mensagem baseado no campo 'type'.
   */
  route(ws, wss, data) {
    const type = String(data?.type || '').trim().toUpperCase();
    const payload = data?.payload ?? data ?? {};

    switch (type) {
      case 'CREATE_ROOM':
        this.handleCreateRoom(ws, payload);
        break;
      case 'JOIN_ROOM':
        this.handleJoinRoom(ws, wss, payload);
        break;
      case 'MAKE_MOVE':
        this.handleMakeMove(ws, wss, payload);
        break;
      case 'REMATCH':
      case 'RESTART':
      case 'PLAY_AGAIN':
        this.handleRematch(ws, wss, payload);
        break;
      default:
        this.sendError(ws, `Tipo de mensagem desconhecido: ${type || '(vazio)'}`);
    }
  }

  handleCreateRoom(ws, payload) {
    const { playerName } = payload || {};
    if (!playerName) {
      return this.sendError(ws, 'Nome do jogador é obrigatório.');
    }
    const roomId = RoomManager.createRoom(ws.id, playerName);
    ws.roomId = roomId; // Vincula o socket à sala
    this.send(ws, 'ROOM_CREATED', { roomId });
  }

  handleJoinRoom(ws, wss, payload) {
    const { roomId, playerName } = payload;
    if (!playerName) {
      return this.sendError(ws, 'Nome do jogador é obrigatório.');
    }
    const result = RoomManager.joinRoom(roomId, ws.id, playerName);

    if (!result) {
      return this.sendError(ws, 'Sala não encontrada ou cheia.');
    }

    ws.roomId = roomId;
    const { symbol, game } = result;

    // Notifica ambos os jogadores que o jogo começou
    this.broadcastToRoom(wss, roomId, (client) => ({
      type: 'GAME_START',
      payload: {
        board: game.board,
        turn: game.currentTurn,
        symbol: client.id === game.players['X'] ? 'X' : 'O',
        players: game.playerNames
      }
    }));
  }

  handleRematch(ws, wss, payload) {
    const roomId = payload?.roomId || ws.roomId;
    const game = RoomManager.getGame(roomId);

    if (!game) {
      return this.sendError(ws, 'Sala não encontrada.');
    }

    if (!game.isFull()) {
      return this.sendError(ws, 'Aguardando oponente para reiniciar.');
    }

    if (game.status !== 'finished') {
      return this.sendError(ws, 'A partida ainda não terminou.');
    }

    game.resetForRematch();

    this.broadcastToRoom(wss, roomId, (client) => ({
      type: 'GAME_START',
      payload: {
        board: game.board,
        turn: game.currentTurn,
        symbol: client.id === game.players['X'] ? 'X' : 'O',
        players: game.playerNames
      }
    }));
  }

  handleMakeMove(ws, wss, payload) {
    const { roomId, position } = payload;
    const game = RoomManager.getGame(roomId);

    if (!game) {
      return this.sendError(ws, 'Sala não encontrada.');
    }

    const result = game.makeMove(ws.id, position);

    if (!result.success) {
      return this.sendError(ws, result.message);
    }

    if (result.winner) {
      this.broadcastToRoom(wss, roomId, {
        type: 'GAME_OVER',
        payload: { winner: result.winner, board: result.board }
      });
    } else {
      this.broadcastToRoom(wss, roomId, {
        type: 'GAME_UPDATE',
        payload: { board: result.board, turn: result.currentTurn }
      });
    }
  }

  // Auxiliares
  send(ws, type, payload) {
    if (ws.readyState === 1) { // OPEN
      ws.send(JSON.stringify({ type, payload }));
    }
  }

  sendError(ws, message) {
    this.send(ws, 'ERROR', { message });
  }

  /**
   * Envia uma mensagem para todos os clientes de uma sala específica.
   * Pode receber um objeto fixo ou uma função que gera o payload por cliente.
   */
  broadcastToRoom(wss, roomId, messageOrFactory) {
    wss.clients.forEach((client) => {
      if (client.roomId === roomId && client.readyState === 1) {
        const message = typeof messageOrFactory === 'function' 
          ? messageOrFactory(client) 
          : messageOrFactory;
        client.send(JSON.stringify(message));
      }
    });
  }
}

module.exports = new ConnectionHandler(); // Singleton

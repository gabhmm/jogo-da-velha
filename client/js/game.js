/**
 * game.js
 * Orquestra a lógica entre o Socket e a UI.
 */

class Game {
    constructor() {
        this.roomId = null;
        this.mySymbol = null;
        this.currentTurn = null;
        this.init();
    }

    init() {
        // Eventos de Botões
        document.getElementById('btnCreate').addEventListener('click', () => this.createRoom());
        document.getElementById('btnJoin').addEventListener('click', () => this.joinRoom());
        document.getElementById('btnLeave').addEventListener('click', () => location.reload());

        // Eventos de Cliques no Tabuleiro
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const index = parseInt(cell.getAttribute('data-index'));
                this.makeMove(index);
            });
        });

        // Ouvir mensagens do servidor
        socket.onMessage((data) => this.handleServerMessage(data));
    }

    createRoom() {
        const playerName = document.getElementById('inputPlayerName').value.trim();
        if (!playerName) {
            ui.updateLobbyMessage('Por favor, insira seu nome.');
            return;
        }
        socket.send('CREATE_ROOM', { playerName });
    }

    joinRoom() {
        const playerName = document.getElementById('inputPlayerName').value.trim();
        const roomId = document.getElementById('inputRoomId').value.toUpperCase();

        if (!playerName) {
            ui.updateLobbyMessage('Por favor, insira seu nome.');
            return;
        }

        if (roomId) {
            socket.send('JOIN_ROOM', { roomId, playerName });
        }
    }

    makeMove(position) {
        if (this.currentTurn !== this.mySymbol) return;
        socket.send('MAKE_MOVE', { roomId: this.roomId, position });
    }

    handleServerMessage(data) {
        const { type, payload } = data;

        switch (type) {
            case 'ROOM_CREATED':
                this.roomId = payload.roomId;
                ui.updateLobbyMessage(`Sala criada! Código: ${this.roomId}. Aguardando oponente...`);
                break;

            case 'GAME_START':
                this.roomId = this.roomId || document.getElementById('inputRoomId').value.toUpperCase();
                this.mySymbol = payload.symbol;
                this.currentTurn = payload.turn;
                ui.showGame();
                ui.setRoomInfo(this.roomId, this.mySymbol);
                ui.setPlayers(payload.players);
                ui.renderBoard(payload.board);
                this.updateStatus();
                break;

            case 'GAME_UPDATE':
                this.currentTurn = payload.turn;
                ui.renderBoard(payload.board);
                this.updateStatus();
                break;

            case 'GAME_OVER':
                this.currentTurn = null;
                ui.showWinner(payload.winner, payload.board);
                break;

            case 'OPPONENT_LEFT':
                alert('Seu oponente saiu da partida.');
                location.reload();
                break;

            case 'ERROR':
                ui.updateStatus(payload.message, true);
                if (ui.lobby.classList.contains('hidden') === false) {
                   ui.updateLobbyMessage(payload.message);
                }
                break;
        }
    }

    updateStatus() {
        const isMyTurn = this.currentTurn === this.mySymbol;
        const message = isMyTurn ? 'Sua vez!' : 'Vez do oponente...';
        ui.updateStatus(message);
        ui.highlightTurn(isMyTurn);
    }
}

// Inicializa o jogo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

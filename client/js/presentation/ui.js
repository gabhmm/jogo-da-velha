/**
 * ui.js
 * Manipulação do DOM e feedback visual.
 */
class UI {
    constructor() {
        this.lobby = document.getElementById('lobby');
        this.gameScreen = document.getElementById('gameScreen');
        this.board = document.getElementById('board');
        this.status = document.getElementById('status');
        this.lobbyMessage = document.getElementById('lobbyMessage');
        this.playerSymbol = document.getElementById('playerSymbol');
        this.roomCode = document.getElementById('roomCode');
        this.playerXName = document.getElementById('playerXName');
        this.playerOName = document.getElementById('playerOName');
        this.cells = document.querySelectorAll('.cell');
    }

    showGame() {
        this.lobby.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
    }

    showLobby() {
        this.lobby.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
    }

    setRoomInfo(roomId, symbol) {
        this.roomCode.innerText = `Sala: #${roomId}`;
        this.playerSymbol.innerText = `Símbolo: ${symbol}`;
    }

    setPlayers(players) {
        this.playerXName.innerText = `X: ${players['X'] || 'Aguardando...'}`;
        this.playerOName.innerText = `O: ${players['O'] || 'Aguardando...'}`;
    }

    updateStatus(message, isError = false) {
        this.status.innerText = message;
        this.status.className = `text-center py-2 rounded-lg font-medium ${isError ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-blue-400'}`;
    }

    updateLobbyMessage(message) {
        this.lobbyMessage.innerText = message;
    }

    renderBoard(boardData) {
        this.cells.forEach((cell, index) => {
            const value = boardData[index];
            cell.innerText = value || '';
            cell.className = 'cell flex items-center justify-center h-24 bg-gray-800 rounded-lg text-5xl font-bold cursor-pointer hover:bg-gray-700 transition-colors';
            
            if (value === 'X') cell.classList.add('text-x');
            if (value === 'O') cell.classList.add('text-o');
        });
    }

    highlightTurn(isMyTurn) {
        if (isMyTurn) {
            this.board.classList.add('my-turn');
        } else {
            this.board.classList.remove('my-turn');
        }
    }

    showWinner(winner, boardData) {
        this.renderBoard(boardData);
        if (winner === 'draw') {
            this.updateStatus('EMPATE!', false);
        } else {
            this.updateStatus(`VITÓRIA DO ${winner}!`, false);
            // Poderíamos adicionar brilho nas células vencedoras aqui futuramente
        }
    }
}

const ui = new UI();

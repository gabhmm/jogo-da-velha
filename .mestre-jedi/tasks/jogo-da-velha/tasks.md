# Tasks — Jogo da Velha Multiplayer (v2.0.0)

## 1. Preparação e Setup do Ambiente
- [x] Inicializar o projeto: `npm init -y`
- [x] Instalar dependências: `npm install ws`
- [x] Instalar dependências de desenvolvimento: `npm install --save-dev jest`
- [x] Configurar `package.json`:
    - [x] Script `"start": "node server/index.js"`
    - [x] Script `"test": "jest"`
- [x] Criar estrutura de pastas física:
    - [x] `server/modules/`
    - [x] `server/tests/`
    - [x] `client/css/`
    - [x] `client/js/communication/`
    - [x] `client/js/presentation/`

## 2. Implementação do Servidor (Core)
- [x] **Módulo: GameLogic.js** (`server/modules/GameLogic.js`)
    - [x] Implementar `checkWinner(board)`: Retorna 'X', 'O', 'draw' ou null.
    - [x] Implementar `isBoardFull(board)`: Retorna booleano.
    - [x] Implementar `isValidMove(board, position)`: Retorna booleano.
- [x] **Módulo: GameLogic.test.js** (`server/tests/GameLogic.test.js`)
    - [x] Testar vitórias (H, V, D).
    - [x] Testar empate.
    - [x] Testar jogadas inválidas.
- [x] **Módulo: GameManager.js** (`server/modules/GameManager.js`)
    - [x] Classe `GameManager` para encapsular estado (board, turn, players).
    - [x] Método `makeMove(playerId, position)`.
- [x] **Módulo: RoomManager.js** (`server/modules/RoomManager.js`)
    - [x] Gerenciamento de Map de salas.
    - [x] Métodos `createRoom()`, `joinRoom(roomId)`, `leaveRoom(playerId)`.

## 3. Implementação do Servidor (Infra)
- [x] **Módulo: ConnectionHandler.js** (`server/modules/ConnectionHandler.js`)
    - [x] Parser de mensagens JSON.
    - [x] Roteamento de tipos: `CREATE_ROOM`, `JOIN_ROOM`, `MAKE_MOVE`.
    - [x] Tratamento de desconexão.
- [x] **Arquivo: index.js** (`server/index.js`)
    - [x] Integração `http` + `ws`.
    - [x] Implementação de Heartbeat (`ping/pong`) a cada 30s.
    - [x] Escuta na porta `process.env.PORT || 3000`.

## 4. Implementação do Cliente (UI/UX)
- [x] **index.html** (`client/index.html`)
    - [x] Importação do Tailwind CSS (CDN).
    - [x] Layout do Tabuleiro (Grid 3x3).
    - [x] Modal/Tela de Entrada para Nome e Código da Sala.
- [x] **style.css** (`client/css/style.css`)
    - [x] Estilos customizados para animações de vitória/jogada.
- [x] **socket.js** (`client/js/communication/socket.js`)
    - [x] Gerenciamento da conexão nativa `new WebSocket()`.
    - [x] Dispatcher de eventos recebidos.
- [x] **ui.js** (`client/js/presentation/ui.js`)
    - [x] Funções `renderBoard()`, `showStatus()`, `showError()`.
- [x] **game.js** (`client/js/game.js`)
    - [x] Lógica de orquestração: Clique na UI -> Envio via Socket -> Resposta -> Update UI.

## 5. Validação e Deploy
- [x] Executar `npm test` e garantir 100% de sucesso.
- [ ] Teste de fumaça local: Dois browsers simulando partida completa.
- [ ] Teste de desconexão: Um jogador fecha a aba, o outro deve ser notificado.
- [ ] Documentar passo a passo de deploy no Render no README.md (opcional).

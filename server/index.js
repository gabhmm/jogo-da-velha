require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const ConnectionHandler = require('./modules/ConnectionHandler');

/**
 * server/index.js
 * Ponto de entrada do servidor com suporte a arquivos estáticos.
 */

const PORT = process.env.PORT || 3000;
const HEARTBEAT_INTERVAL = parseInt(process.env.HEARTBEAT_INTERVAL) || 30000;

// Servidor HTTP para servir o Frontend e o WebSocket
const server = http.createServer((req, res) => {
  // Traduz a URL para o caminho do arquivo
  let filePath = req.url === '/' 
    ? path.join(__dirname, '../client/index.html') 
    : path.join(__dirname, '../client', req.url);

  // Determina o Content-Type baseado na extensão
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js': contentType = 'text/javascript'; break;
    case '.css': contentType = 'text/css'; break;
    case '.json': contentType = 'application/json'; break;
    case '.png': contentType = 'image/png'; break;
    case '.jpg': contentType = 'image/jpg'; break;
  }

  // Tenta ler o arquivo
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Arquivo não encontrado');
      } else {
        res.writeHead(500);
        res.end(`Erro no servidor: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Inicializa o servidor WebSocket
const wss = new WebSocketServer({ server });

let connectionIdCounter = 0;

wss.on('connection', (ws) => {
  ws.id = `player_${++connectionIdCounter}_${Date.now()}`;
  ws.isAlive = true;

  console.log(`[Server] Nova conexão: ${ws.id}`);

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ConnectionHandler.handle(ws, wss);
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log(`[Server] Terminando conexão ociosa: ${ws.id}`);
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => {
  clearInterval(interval);
});

server.listen(PORT, () => {
  console.log(`[Server] Ouvindo na porta ${PORT}`);
  console.log(`[Server] Acesse http://localhost:${PORT} para jogar`);
});

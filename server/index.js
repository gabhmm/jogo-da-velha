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
  // Remove query strings da URL (ex: /style.css?v=1 -> /style.css)
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // Traduz a URL para o caminho do arquivo
  let filePath = pathname === '/' 
    ? path.join(__dirname, '../client/index.html') 
    : path.join(__dirname, '../client', pathname);

  // Determina o Content-Type baseado na extensão
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error(`[Server] 404: ${filePath}`);
        res.writeHead(404);
        res.end('Arquivo não encontrado');
      } else {
        console.error(`[Server] 500: ${error.code} ao ler ${filePath}`);
        res.writeHead(500);
        res.end(`Erro no servidor: ${error.code}`);
      }
    } else {
      console.log(`[Server] Servindo: ${pathname} (${contentType})`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
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

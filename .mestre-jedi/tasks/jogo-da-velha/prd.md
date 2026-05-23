# PRD — Jogo da Velha Multiplayer

## 1. Problema
O mercado de entretenimento casual carece de uma implementação de Jogo da Velha que seja ao mesmo tempo simples, robusta e capaz de suportar múltiplos jogadores via WebSockets puros, sem a sobrecarga de frameworks como Socket.io.

## 2. Objetivos
- Criar um servidor Node.js que gerencie salas de jogo.
- Implementar a lógica de jogo no servidor para evitar trapaças.
- Prover uma interface web responsiva para os jogadores.
- Garantir comunicação em tempo real de baixa latência.

## 3. Critérios de Aceite
- [ ] O jogador pode criar uma sala e receber um código único.
- [ ] Um segundo jogador pode entrar na sala usando o código.
- [ ] O jogo começa apenas quando há 2 jogadores.
- [ ] O servidor valida cada jogada e alterna os turnos.
- [ ] O servidor detecta vitória (horizontal, vertical, diagonal) e empate.
- [ ] Se um jogador sair, o outro é notificado imediatamente.
- [ ] Implementação de testes unitários para a lógica de jogo.

## 4. Requisitos Não Funcionais
- Uso de WebSockets nativos (`ws`).
- **Arquitetura:** Baseada em camadas simples (Separação de Lógica, Estado e Comunicação).
- Sem dependência de banco de dados (estado em memória).
- **Hospedagem:** Compatível com a plataforma **Render** (configuração de porta via variável de ambiente `PORT` e suporte a conexões WebSocket persistentes).

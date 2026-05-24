const GameManager = require('../modules/GameManager');

describe('GameManager', () => {
  let game;

  beforeEach(() => {
    game = new GameManager();
  });

  test('deve iniciar com estado esperando jogadores', () => {
    expect(game.status).toBe('waiting');
    expect(game.board).toEqual(Array(9).fill(null));
  });

  test('deve adicionar jogadores e mudar status para playing', () => {
    const s1 = game.addPlayer('p1', 'Player 1');
    expect(s1).toBe('X');
    expect(game.status).toBe('waiting');

    const s2 = game.addPlayer('p2', 'Player 2');
    expect(s2).toBe('O');
    expect(game.status).toBe('playing');
  });

  test('deve alternar turnos após jogada válida', () => {
    game.addPlayer('p1', 'Player 1');
    game.addPlayer('p2', 'Player 2');

    const result = game.makeMove('p1', 0);
    expect(result.success).toBe(true);
    expect(game.currentTurn).toBe('O');
    expect(game.board[0]).toBe('X');
  });

  test('não deve permitir jogada fora do turno', () => {
    game.addPlayer('p1', 'Player 1');
    game.addPlayer('p2', 'Player 2');

    const result = game.makeMove('p2', 0); // O tentando jogar no turno de X
    expect(result.success).toBe(false);
    expect(result.message).toBe('Não é o seu turno.');
  });

  test('deve detectar fim de jogo', () => {
    game.addPlayer('p1', 'Player 1');
    game.addPlayer('p2', 'Player 2');

    game.makeMove('p1', 0); // X
    game.makeMove('p2', 3); // O
    game.makeMove('p1', 1); // X
    game.makeMove('p2', 4); // O
    const result = game.makeMove('p1', 2); // X vence

    expect(result.winner).toBe('X');
    expect(game.status).toBe('finished');
  });

  test('deve reiniciar partida para rematch', () => {
    game.addPlayer('p1', 'Player 1');
    game.addPlayer('p2', 'Player 2');
    game.makeMove('p1', 0);
    game.makeMove('p2', 3);
    game.makeMove('p1', 1);
    game.makeMove('p2', 4);
    game.makeMove('p1', 2);

    expect(game.status).toBe('finished');

    game.resetForRematch();

    expect(game.status).toBe('playing');
    expect(game.board).toEqual(Array(9).fill(null));
    expect(game.currentTurn).toBe('X');
    expect(game.winner).toBeNull();
    expect(game.players['X']).toBe('p1');
    expect(game.players['O']).toBe('p2');
  });
});

const { checkWinner, isBoardFull, isValidMove } = require('../modules/GameLogic');

describe('GameLogic', () => {
  let board;

  beforeEach(() => {
    board = Array(9).fill(null);
  });

  test('deve detectar vitória na linha horizontal', () => {
    board[0] = board[1] = board[2] = 'X';
    expect(checkWinner(board)).toBe('X');
  });

  test('deve detectar vitória na linha vertical', () => {
    board[0] = board[3] = board[6] = 'O';
    expect(checkWinner(board)).toBe('O');
  });

  test('deve detectar vitória na diagonal', () => {
    board[0] = board[4] = board[8] = 'X';
    expect(checkWinner(board)).toBe('X');
  });

  test('deve detectar empate quando o tabuleiro está cheio', () => {
    const fullBoard = ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O'];
    expect(checkWinner(fullBoard)).toBe('draw');
  });

  test('deve retornar null se o jogo ainda está em andamento', () => {
    board[0] = 'X';
    expect(checkWinner(board)).toBeNull();
  });

  test('deve validar se uma posição está vazia', () => {
    board[0] = 'X';
    expect(isValidMove(board, 0)).toBe(false);
    expect(isValidMove(board, 1)).toBe(true);
  });

  test('deve rejeitar posições fora do intervalo 0-8', () => {
    expect(isValidMove(board, -1)).toBe(false);
    expect(isValidMove(board, 9)).toBe(false);
  });
});

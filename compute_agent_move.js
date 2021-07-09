const { workerData, parentPort } = require('worker_threads');
const Board = require('./board');
const AlphaBetaAgent = require('./alpha_beta_agent');

// Create new board with board sent by client
const board = new Board(workerData.board);
board.width = workerData.board_width;
board.height = workerData.board_height;
board.num_win = workerData.board_num_win;
// Calculate which player the AI is
board.player = (workerData.player % 2) + 1;

// Create AI agent and make a move on the board
const alpha_beta_agent = new AlphaBetaAgent('AI', workerData.negamax_depth);
const move = alpha_beta_agent.go(board);
board.add_token(move);

// Send response back to main thread
parentPort.postMessage({
    board: board.board,
    move: move,
    win: board.get_outcome()
});

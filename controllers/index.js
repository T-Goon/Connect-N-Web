const AlphaBetaAgent = require('../alpha_beta_agent');
const Board = require('../board');

// for route GET '/'
exports.show_index = (req, res, next) => {
    res.render('index', { title: 'Connect 4 Negamax' });
}

// For route POST '/move'
exports.make_move = (req, res, next) => {

    try {
        // Create new board with board sent by client
        const board = new Board(req.body.board);
        board.player = (req.body.player % 2) + 1;

        // Create AI agent and make a move on the board
        const alpha_beta_agent = new AlphaBetaAgent('AI', 6);
        const move = alpha_beta_agent.go(board);
        board.add_token(move);

        // Send response
        const res_json = {
            board: board.board,
            move: move,
            win: board.get_outcome()
        };

        res.json(res_json);
    }
    catch (err) {
        console.log(err)
    }
};

// Route for POST '/check_player_win'
exports.check_player_win = (req, res, next) => {
    // Create new board with board sent by client
    const board = new Board(req.body.board);

    // Send response
    const res_json = {
        win: board.get_outcome()
    };

    res.json(res_json);
};
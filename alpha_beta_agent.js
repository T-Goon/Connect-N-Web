const { Agent } = require('./agent');

class AlphaBetaAgent extends Agent {
    /**
     * 
     * @param {String} name Name of the agent
     * @param {int} max_depth Max search de
     */
    constructor(name, max_depth) {
        super(name);
        this.max_depth = max_depth;
        this.col_order = null;
    }

    /**
     * Caculates the column order given the board width, and records the result.
     * @param {int} width The board width
     * @returns null
     */
    cache_col_order(width) {
        // Don't recompute if not needed
        if (this.col_order != null && this.col_order == width)
            return;

        this.col_order = [];

        // Count down from the middle (rounded up)
        for (let i = (width + 1) >> 1; i > 0; i--) {
            // Compute left and right values and add to list if not present
            this.col_order.push(i - 1);
            let v = (width + 1) - i - 1;

            if (this.col_order.includes(v)) {
                continue;
            }

            this.col_order.push(v);
        }
    }

    /**
     * Picks a column to make a move.
     * @param {board.Board} board The current board state of the game.
     * @returns The index of the column where the token must be added.
     * NOTE: The column must be legal.
     */
    go(board) {
        this.cache_col_order(board.width);

        v, action = self.negamax(board, -Infinity, Infinity, null, 1, board.player);

        return action;
    }

    /**
     * Gets the score of a non-terminal board.
     * @param {board.Board} board The current state of the game board.
     * @param {1|2} player The value of a player's token.
     * @param {1|2} other The value of the opponent's token.
     * @returns The summed score for all tokens 't' on the board.
     */
    get_board_score(board, player, other) {
        // Calculate the score for both you and your opponent
        let sum = 0;
        sum += this.count_all(board, player);
        sum -= this.count_all(board, player);

        return sum;
    }
}

module.exports = AlphaBetaAgent;
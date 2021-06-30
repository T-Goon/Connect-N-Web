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
}

module.exports = AlphaBetaAgent;
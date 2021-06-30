const { max, cloneDeep } = require('lodash');
const { Agent } = require('./agent');
const Board = require('./board');

const VERY_LARGE_NUM = 100000000000000000000000000;

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

        const [v, action] = self.negamax(board, -Infinity, Infinity, null, 1, board.player);

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

        if (typeof board === 'undefined' || typeof player === 'undefined' || typeof other === 'undefined')
            return new Error('Bad input');

        let sum = 0;
        sum += this.count_all(board, player);
        sum -= this.count_all(board, other);

        return sum;
    }

    /**
     * Gets the score of all tokens on the board for specified token t.
     * @param {board.Board} board The current state of the game board.
     * @param {1|2} token The value of a player's token
     * @returns The summed score for tokens 't' on the board.
     */
    count_all(board, token) {
        if (typeof board === 'undefined' || typeof token === 'undefined')
            return new Error('Bad input');

        let sum = 0;

        // Go through all spaces on the board
        for (let i = 0; i < board.height; i++) {
            for (let j = 0; j < board.width; j++) {
                // Only eval for the specified token
                if (board.board[i][j] == token) {
                    sum += this.token_score(board, j, i, token);
                }
            }
        }

        return sum;
    }

    /**
     * Gets the score of a token in all 8 directions.
     * @param {board.Board} board The current state of the game board.
     * @param {int} x The index of the column of the token on the board.
     * @param {int} y The index of the row of the token on the board.
     * @param {1|2} token The value of a player's token.
     * @returns Summed score for all 8 directions of a token.
     */
    token_score(board, x, y, token) {
        if (typeof board === 'undefined' || typeof x === 'undefined' || typeof y === 'undefined' || typeof token === 'undefined')
            return new Error('Bad input');

        // Look in all 8 directions for 0 tokens and 'token' tokens
        let sum = 0

        sum += this.count_line(board, x, y, 0, 1, token); // Up
        sum += this.count_line(board, x, y, 1, 1, token); // Diagonal Up Right
        sum += this.count_line(board, x, y, 1, 0, token); // Right
        sum += this.count_line(board, x, y, 1, -1, token); // Diagonal Down Right
        sum += this.count_line(board, x, y, 0, -1, token); // Down
        sum += this.count_line(board, x, y, -1, -1, token); // Diagonal Down Left
        sum += this.count_line(board, x, y, -1, 0, token); // Left
        sum += this.count_line(board, x, y, -1, 1, token); // Diagonal Up Left

        return sum;
    }

    /**
     * Gets the score for a token in one direction.
     * @param {board.Board} board The current state of the board.
     * @param {int} x The index of the column of the token on the board.
     * @param {int} y The index of the row of the token on the board.
     * @param {-1|0|1} dx The x direction to look in.
     * @param {-1|0|1} dy The y direction to look in.
     * @param {1|2} token The value of a player's token.
     * @returns The summed score for a single direction of a token.
     */
    count_line(board, x, y, dx, dy, token) {
        if (typeof board === 'undefined' || typeof x === 'undefined' || typeof y === 'undefined'
            || typeof dx === 'undefined' || typeof dy === 'undefined' || typeof token === 'undefined')
            return new Error('Bad input');

        let sum = 0;

        let board_array = board.board;

        for (let i = 1; i < board.num_win; i++) {
            try {
                let row = y + (dy * i);
                let col = x + (dx * i);

                // Don't allow indexes to go negative
                if (row < 0 || col < 0)
                    return 0;

                // Found one of your tokens
                if (token == board_array[row][col])
                    sum += 2;
                // Found empty space
                else if (0 == board_array[row][col])
                    sum += 1
                // Found opponent token, discard direction score
                else
                    return 0;

            } catch (err) {
                // Went out of bounds of array, discard direction score
                return 0;
            }
        }

        return sum;
    }

    /**
     * Calculates the optimal move and value of the given board for the given player.
     * @param {board.Board} board The current state of the game board.
     * @param {int} alpha The alpha value for alpha beta pruning
     * @param {int} beta The beta value for alpha beta pruning
     * @param {int} old_action The index of the column played to reach this board state
     * @param {int} depth The current depth of the negamax search in the recursion
     * @param {1|2} player The player to run the search for.
     * @returns An array containing the max value found in the negamax search and the move to take to get there.
     */
    negamax(board, alpha, beta, old_action, depth, player) {
        // Cache board outcome since get_outcome() is a bit expensive to calculate.
        let winner = board.get_outcome();
        let other_player = (player % 2) + 1;
        let successors = self.get_successors(board);

        // Calculate immediate win or loss and cache
        // Could also be done in get_board_score()

        // Check for win
        if (winner == player) return [VERY_LARGE_NUM / depth, old_action];
        if (winner == other_player) return [-VERY_LARGE_NUM / depth, old_action];
        if (depth ==  this.max_depth || successors.length == 0) return [this.get_board_score(board, player, other_player), old_action];
        
        // Standard negamax
        let value = -Infinity;
        let action = null;
        for(let i=0; i<successors.length; i++) {
            let next_board = successors[i];

            // It is notable that `nv` is negated every time it is used, this is a key property of negamax.
            const [new_value, new_action] = this.negamax(next_board[0], -beta, -alpha, next_board[1], depth+1, other_player);

            if (-new_value > value) {
                value = -new_value;
                action = next_board[1];
            }

            alpha = max([alpha, value]);

            if(alpha >= beta) 
                return [value, new_action];
            
            return [value, action];
        }
    }

    /**
     * Get the successors of the given board in order of middle outwards.
     * @param {board.Board} board The current state of the game board.
     * @returns An array of successor boards along with the column where the last token was added to it.
     */
    get_successors(board) {
        // Get possible actions, favors middle of board
        let free_cols = [];
        for(let i=0; i<this.col_order.length; i++) {
            if(board.board[board.board.length-1][i] == 0)
                free_cols.push(this.col_order[i]);
        }

        // Any legal actions left?
        if (free_cols.length == 0) 
            return [];

        // Make list of new boards along with the corresponding actions
        let successors = [];

        for(let i=0; i<free_cols.length; i++) {
            const col = free_cols[i];

            let new_board = board.copy();

            // Add a token to the new board, will change new_board.player
            new_board.add_token(col);
            // Add board to list of successors
            successors.push([new_board, col]);
        }

        return successors;
    }
}

module.exports = AlphaBetaAgent;
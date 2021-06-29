
// Abstract Agent class
class Agent {
    /**
     * Constructor
     * @param {String} name name of the player
     */
    constructor(name) {
        this.name = name;
        // Uninitialized player - will be set upon starting a Game
        this.player = 0;
    }

    /**
     * Pick a column.
     * @param {board.Board} board the current board state
     * @returns the index of the column where the token must be added
     */
    go(board) {
        throw new Error('Implement this method in a subclass');
    }
}

exports.Agent = Agent;

// Interactive Agent
class InteractiveAgent extends Agent {
    /**
     * Ask a human to pick a column.
     * @param {board.Board} board the current board state (ignored)
     * @returns the index of the column where the token must be added
     */
    go(board) {
        let freeCols = board.free_cols();
        // TODO get input from the user
        let col;
        while(!freeCols.includes(col)) {
            // TODO tell user token cannot be placed
            // TODO get input from user again
        }

        return col;
    }
}

exports.InteractiveAgent = InteractiveAgent;
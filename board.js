const lodash = require('lodash');

/*
A connect 4 board class.
NOTE: The boards printed as arrays will look upside down
*/
class Board {
    /**
     * Constructor
     * @param {2D list of ints} board the board configuration, row-major
     */
    constructor(board) {
        this.board = board;
        this.width = 7;
        this.height = 6;
        this.num_win = 4;
        this.player = 1;
    }

    /**
     * Makes a copy of the current board
     * @returns A deep copy of this board
     */
    copy() {
        let copy = new Board(lodash.cloneDeep(this.board), this.width, this.height);

        copy.player = this.player;
        return copy;
    }

    /**
     * Check if a line of identical tokens exists starting at (x,y) in direction (dx,dy)
     * @param {int} x the x coordinate of the starting cell
     * @param {int} y the y coordinate of the starting cell
     * @param {-1|0|1} dx the step in the x direction
     * @param {-1|0|1} dy the step in the y direction
     * @returns True if n tokens of the same type have been found, False otherwise
     */
    is_line_at(x, y, dx, dy) {
        // Avoid out of bounds errors
        if ((x + (this.num_win - 1) * dx >= this.width) ||
            (y + (this.num_win - 1) * dy) < 0 || (y + (this.num_win - 1) * dy >= this.height))
            return false;


        // Get token at (x, y)
        let t = this.board[y][x];
        // Go through elements
        for (let i = 0; i < this.num_win; i++) {
            if (this.board[y + i * dy][x + i * dx] != t) {
                return false;
            }
        }

        return true;

    }

    /**
     * Check if a line of identical tokens exists starting at (x,y) in any direction
     * @param {int} x the x coordinate of the starting cell
     * @param {int} y the y coordinate of the starting cell
     * @returns True if n tokens of the same type have been found, False otherwise
     */
    is_any_line_at(x, y) {
        return (this.is_line_at(x, y, 1, 0) || // Horizontal
            this.is_line_at(x, y, 0, 1) || // Vertical
            this.is_line_at(x, y, 1, 1) || // Diagonal Up
            this.is_line_at(x, y, 1, -1)) // Diagonal Down
    }

    /**
     * Returns the winner of the game in the current board, if any.
     * @returns 1 for Player 1, 2 for Player 2, and 0 for no winner
     */
    get_outcome() {
        // Loop through all board spaces
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {

                // Check for a line at any non-0 spaces
                if (this.board[y][x] != 0 && this.is_any_line_at(x, y))
                    return this.board[y][x];
            }
        }

        return 0;
    }

    /**
     * Adds a token for the current player at the given column
     * @param {int} x The column where the token must be added; the column is assumed not full.
     */
    add_token(x) {
        // Find empty slot for token
        let y = 0;

        // Walk up column until an empy spot is found
        while (this.board[y][x] != 0)
            y = y + 1;

        this.board[y][x] = this.player;

        // Switch player
        if (this.player == 1) this.player = 2;
        else this.player = 1;
    }

    /**
     * Returns a list of the columns with at least one free slot.
     * @returns An array of indexes of columns with at least one free slot
     */
    free_cols() {
        let free = [];

        // Loop through all columns
        for (let x = 0; x < this.width; x++)
            // Add to free list if a free slot (0) is found
            if (this.board[this.board.length - 1][x] == 0)
                free.push(x);

        return free;
    }

    print_it() {
        // '+----------+'
        console.log('+' + '-'.repeat(this.width) + "+");

        // Print numbers on the board
        for (let y = this.height - 1; y > -1; y--) {
            process.stdout.write('|');

            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x] == 0) process.stdout.write(' ');
                else process.stdout.write(this.board[y][x].toString());
            }
            console.log('|');
        }

        // '+----------+'
        console.log('+' + '-'.repeat(this.width) + "+");
        process.stdout.write(' ');

        // Print column numbers
        for (let i = 0; i < this.width; i++) {
            process.stdout.write(i.toString());
        }
        console.log('');
    }
}

module.exports = Board;
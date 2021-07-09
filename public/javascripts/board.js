/*
A connect 4 board class.
Same as the class on the serverside but reduced.
NOTE: The boards printed as arrays will look upside down
*/
class Board {
    /**
     * Constructor
     * @param {2D list of ints} board the board configuration, row-major
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.num_win = 4;
        this.player = 1;

        this.board = null;
        this.reset_board();

        this.num_peices_in_cols = null;
        this.reset_num_peices_in_cols(); // num game peices in each column
    }

    /**
     * Reset all spaces on the board to 0.
     */
    reset_board() {
        this.board = new Array();
        for (let i = 0; i < this.height; i++) {
            this.board.push(new Array(this.width).fill(0));
        }
    }

    /**
     * Reset the logs for number of peices in each column of the board to 0.
     */
    reset_num_peices_in_cols() {
        this.num_peices_in_cols = new Array(this.width).fill(0);
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
    }

    /**
     * Returns a list of the columns with at least one free slot.
     * @returns An array of indexes of columns with at least one free slot
     */
    free_cols() {
        let free = [];

        for (let i = 0; i < this.width; i++)
            if (this.num_peices_in_cols[i] != this.height)
                free.push(i);

        return free;
    }
}
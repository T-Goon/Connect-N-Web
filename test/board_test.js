const assert = require('assert');
const Board = require('../board');

describe('Simple Board Tests', () => {
    it('Constructor Test', () => {
        let b = new Board([
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.height, 6);
        assert.strictEqual(b.width, 7);
        assert.strictEqual(b.num_win, 4);
        assert.strictEqual(b.player, 1);
    });

    it('Copy Test', () => {
        let b = new Board([
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        let b2 = b.copy();

        b.board[1][1] = 1;
        b.height = 10;

        assert.notStrictEqual(b2.height, b.height);
        assert.notStrictEqual(b2.board[1][1], b.board[1][1]);
    });

    it('Line Test True', () => {
        let b = new Board([
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.is_line_at(6, 0, -1, 1), true);
    });

    it('Line Test False', () => {
        let b = new Board([
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.is_line_at(5, 1, -1, 1), false);
    });

    it('Line Test Out of Bounds', () => {
        let b = new Board([
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.is_line_at(6, 0, 0, -1), false);
    });

    it('Any Line at Test', () => {
        let b = new Board([
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.is_any_line_at(0, 5), true);
    });

    it('Get Outcome Test Player 1', () => {
        let b = new Board([
            [1, 2, 2, 2, 0, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.get_outcome(), 1);
    });

    it('Get Outcome Test Player 2', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.get_outcome(), 2);
    });

    it('Get Outcome Test None', () => {
        let b = new Board([
            [1, 2, 2, 2, 0, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        assert.strictEqual(b.get_outcome(), 0);

    });

    it('Add Token Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 0, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        b.add_token(5);
        assert.strictEqual(b.board[0][5], 1);
    });

    it('Free Cols Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 1],
            [1, 1, 2, 2, 2, 0, 1],
            [1, 2, 1, 2, 2, 0, 1],
            [1, 2, 1, 0, 2, 0, 1],
            [1, 2, 1, 0, 2, 0, 1],
            [0, 2, 1, 0, 2, 0, 1]]);

        assert.deepStrictEqual(b.free_cols(), [0, 3, 5]);
    });

    it('Print it Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 1],
            [1, 1, 2, 2, 2, 0, 1],
            [1, 2, 1, 2, 2, 0, 1],
            [1, 2, 1, 0, 2, 0, 1],
            [1, 2, 1, 0, 2, 0, 1],
            [0, 2, 1, 0, 2, 0, 1]]);

        b.print_it();
    });
})
const assert = require('assert');
const AlphaBetaAgent = require('../alpha_beta_agent');
const Board = require('../board');

describe('Simple AlphaBeta Agent Test', () => {
    it('Constructor Test', () => {
        const agent = new AlphaBetaAgent('bob', 5);
    });

    it('Cache Column Order Test', () => {
        const agent = new AlphaBetaAgent('bob', 5);

        agent.cache_col_order(6);

        assert.deepStrictEqual(agent.col_order, [2, 3, 1, 4, 0, 5]);
    });

    it('Count Line Test Out of Bounds Neg', () => {
        let b = new Board([ [1, 2, 2, 2, 2, 0, 0],
                            [0, 1, 2, 2, 0, 0, 0],
                            [0, 0, 1, 2, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 3, 2, -1, -1, 2), 0);
    });

    it('Count Line Test Out of Bounds Pos', () => {
        let b = new Board([ [1, 2, 2, 2, 2, 0, 0],
                            [0, 1, 2, 2, 0, 0, 0],
                            [0, 0, 1, 2, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 4, 0, 1, 0, 2), 0);
    });

    it('Count Line Test Opposing Token', () => {
        let b = new Board([ [1, 2, 2, 2, 2, 0, 0],
                            [0, 1, 2, 2, 0, 0, 0],
                            [0, 0, 1, 2, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 3, 2, -1, 0, 2), 0);
    });

    it('Count Line Test OK', () => {
        let b = new Board([ [1, 2, 2, 2, 2, 0, 0],
                            [0, 1, 2, 2, 0, 0, 0],
                            [0, 0, 1, 2, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 3, 0, 0, 1, 2), 5);
    });

    it('Go test', () => {
        //TODO finish the test
    })

    it('Get Board Score Test', () => {
        // TODO finish the test
    });

    it('Count All Test', () => {
        // TODO finish the test
    });

    it('Token Score Test', () => {
        // TODO finish the test
    });
});
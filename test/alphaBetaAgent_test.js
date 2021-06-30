const assert = require('assert');
const AlphaBetaAgent = require('../alpha_beta_agent');

describe('Simple AlphaBeta Agent Test', () => {
    it('Constructor Test', () => {
        const agent = new AlphaBetaAgent('bob', 5);
    });

    it('Cache Column Order Test', () => {
        const agent = new AlphaBetaAgent('bob', 5);

        agent.cache_col_order(6);

        assert.deepStrictEqual(agent.col_order, [2, 3, 1, 4, 0, 5]);
    });

    it('Go test', () => {
        //TODO finish the test
    })

    it('Get Board Score Test', () => {
        // TODO finish the test
    });
});
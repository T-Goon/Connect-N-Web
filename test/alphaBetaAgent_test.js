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
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 3, 2, -1, -1, 2), 0);
    });

    it('Count Line Test Out of Bounds Pos', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 4, 0, 1, 0, 2), 0);
    });

    it('Count Line Test Opposing Token', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 3, 2, -1, 0, 2), 0);
    });

    it('Count Line Test OK', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_line(b, 3, 0, 0, 1, 2), 5);
    });

    it('Token Score Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.token_score(b, 3, 0, 2), 16);
    });

    it('Count All Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.count_all(b, 2), 75);
    });

    it('Get Board Score Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        assert.strictEqual(agent.get_board_score(b, 2, 1), 54);
    });

    it('Get Successors Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        let answers = [];

        answers.push([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        answers.push([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        answers.push([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 1, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        answers.push([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 1, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        answers.push([
            [1, 2, 2, 2, 2, 1, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        answers.push([
            [1, 2, 2, 2, 2, 0, 0],
            [1, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        answers.push([
            [1, 2, 2, 2, 2, 0, 1],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        agent.cache_col_order(b.width);
        const successors = agent.get_successors(b);

        for (let i = 0; i < successors.length; i++) {
            assert.deepStrictEqual(successors[i][0].board, answers[i]);
        }
    });

    it('Don\'t Crash Negamax Test', () => {
        let b = new Board([
            [1, 2, 2, 2, 2, 0, 0],
            [0, 1, 2, 2, 0, 0, 0],
            [0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);

        const agent = new AlphaBetaAgent('bob', 5);

        agent.cache_col_order(b.width);

        const [v, action] = agent.negamax(b, -Infinity, Infinity, null, 1, b.player);
    });

    it('Go test', () => {
        //TODO finish the test
    });

});
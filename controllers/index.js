const AlphaBetaAgent = require('../alpha_beta_agent');
const Board = require('../board');
const { Worker } = require('worker_threads');

// for route GET '/'
exports.show_index = (req, res, next) => {
    res.render('index', { title: 'Connect N Negamax' });
}

// For route POST '/move'
exports.make_move = (req, res, next) => {
    // Create new worker thread
    const worker = new Worker('./compute_agent_move.js', { workerData: req.body });

    // Worker sends back result
    worker.on('message', (value) => {
        res.json(value);
    });

    worker.on('error', () => { next(new Error('Worker Error')); });

    worker.on('exit', (code) => {
        if (code !== 0)
            next(new Error('Worker Error'));
    });

};
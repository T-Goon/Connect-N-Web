
exports.show_index = (req, res, next) => {
    res.render('index', { title: 'Express' });
}

exports.make_move = (req, res, next) => {
    console.log('a move was made')
    console.log(req.body);
    res.send(req.body);
};
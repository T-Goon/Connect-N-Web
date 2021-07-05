var express = require('express');
var router = express.Router();
const index = require('../controllers/index');

/* GET home page. */
router.get('/', index.show_index);

router.post('/move', index.make_move);
router.post('/check_player_win', index.check_player_win);

module.exports = router;

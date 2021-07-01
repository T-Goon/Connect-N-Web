var express = require('express');
var router = express.Router();
const index = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/move', (req, res, next) => {
  res.send({});
});

module.exports = router;

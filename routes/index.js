var express = require('express');
var router = express.Router();

var api = require('./api').API;

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
	console.log('index route');
	res.sendFile('public/index.html',{root: './'});
});

router.get('/api/configs/:_id', api.config.getConfig);
router.put('/api/configs/:_id', api.config.postConfig);
router.get('/api/cblocks', api.blocks.getBlocks);
router.post('/api/cblocks', api.blocks.postBlock);
router.post('/api/cawps', api.awps.postAwp);

module.exports = router;

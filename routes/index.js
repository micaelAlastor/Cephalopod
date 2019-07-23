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
router.put('/api/cblocks/:_id', api.blocks.putBlock);
router.post('/api/cawps', api.awps.postAwp);
router.put('/api/cawps/:_id', api.awps.putAwp);
router.post('/api/cnodes', api.nodes.postNode);
router.put('/api/cnodes/:_id', api.nodes.putNode);

module.exports = router;

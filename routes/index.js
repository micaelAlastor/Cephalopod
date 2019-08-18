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
//router.get('/api/cnodes/:_id', api.nodes.getNode);
router.post('/api/cnodes', api.nodes.postNode);
router.put('/api/cnodes/:_id', api.nodes.putNode);

//pc api calls
router.post('/api/wakeup', function (req, res) {
	console.log('wake on lan: ');
	let node = req.body;
	console.log(node);      // your JSON
	//console.log('ssh is ', ssh);      // your JSON
	// {address: node.ip}
	wol.wake(node.mac);
	//
	res.json(node);
});

router.post('/api/block/wakeup', function (req, res) {
	console.log('wake block on lan: ');

	let foundBlock = localNetwork.blocks.find(function (aBlock) {
		return aBlock.id === req.body.id;
	});

	foundBlock.nodes.forEach(function (sleepyNode) {
		wol.wake(sleepyNode.mac);
	});
	//
	res.json(foundBlock);
});

router.post('/api/reboot', function (req, res) {
	console.log('reboot: ');
	let node = req.body;
	console.log(node);      // your JSON
	//
	sequest('fma@' + node.ip,
		{
			command: 'sudo shutdown --reboot now "System goes on reboot now"',
			username: 'fma',
			password: 'lordofether'
		},
		function (e, stdout) {
			if (e) {
				console.log(e);
				//throw e;
			}
			console.log(stdout.split('\n'))
		});
	//
	res.json(node);
});

router.post('/api/shutdown', function (req, res) {
	console.log('shutdown: ');
	let node = req.body;
	console.log(node);      // your JSON
	//
	sequest('fma@' + node.ip,
		{
			command: 'sudo shutdown -P now "System goes down now"',
			username: 'fma',
			password: 'lordofether'
		},
		function (e, stdout) {
			if (e) {
				console.log(e);
				//throw e;
			}
			console.log(stdout.split('\n'))
		});
	//
	res.json(node);
});

//pjlink api calls

router.post('/api/pjpoweron', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;
	let pjBeamers = res.app.locals.pjBeamers;
	console.log('pjlink poweron: ');
	let id = req.body.id;
	let node = localNetwork.findNodeById(id);
	//console.log(node);      // your JSON
	//

	pjBeamers[node.id].powerOn(function (err) {
		if (err) {
			console.log('error turning on', err);
			return;
		}
	});
	//
	res.json(node);
});

router.post('/api/pjpoweroff', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;
	let pjBeamers = res.app.locals.pjBeamers;
	console.log('shutdown: ');
	let id = req.body.id;
	let node = localNetwork.findNodeById(id);
	//console.log(node);      // your JSON
	//
	pjBeamers[node.id].powerOff(function (err) {
		if (err) {
			console.log('error turning off', err);
			return;
		}
	});
	//
	res.json(node);
});

module.exports = router;

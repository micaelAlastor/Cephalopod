var express = require('express');
var router = express.Router();
const fs = require('fs');

const api = require('./api').API;


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
	console.log('index route');
	res.sendFile('public/index.html',{root: './'});
});

router.get('/api/configs/:_id', api.config.getConfig);
router.post('/api/configs/:_id', api.config.saveConfig);
router.put('/api/configs/:_id', api.config.saveConfig);
router.get('/api/cblocks', api.blocks.getBlocks);
router.post('/api/cblocks', api.blocks.postBlock);
router.put('/api/cblocks/:_id', api.blocks.putBlock);
router.delete('/api/cblocks/:_id', api.blocks.deleteBlock);
router.post('/api/cawps', api.awps.postAwp);
router.put('/api/cawps/:_id', api.awps.putAwp);
router.delete('/api/cawps/:_id', api.awps.deleteAwp);
//router.get('/api/cnodes/:_id', api.nodes.getNode);
router.post('/api/cnodes', api.nodes.postNode);
router.put('/api/cnodes/:_id', api.nodes.putNode);
router.delete('/api/cnodes/:_id', api.nodes.deleteNode);

//load settings and scheme from files
router.post('/api/reload', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;

	console.log('reloading scheme from json..');
	let rawdata = '';
	try {
		rawdata = fs.readFileSync('network.json');
	} catch (e) {
		console.log(e);
	}
	let networkScheme = {ssh: {}, blocks: []};
	try {
		networkScheme = JSON.parse(rawdata);
	} catch (e) {
		console.log(e);
	}
	console.log(networkScheme);

	//reading settings
	let settingsJSON = '';
	try {
		settingsJSON = fs.readFileSync('settings.json');
	} catch (e) {
		console.log(e);
	}
	let settings = {};
	try {
		settings = JSON.parse(settingsJSON);
	} catch (e) {
		console.log(e);
	}
	console.log(settings);
	localNetwork.settings = settings;

	//ssh = networkScheme.ssh;
	localNetwork.acceptData(networkScheme);
	res.json({reloaded: true});
});

//pc api calls
router.post('/api/wakeup', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;
	//
	let node = localNetwork.findNodeById(req.body.id);
	node.wakeup();
	//
	res.json(node);
});

router.post('/api/reboot', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;
	//
	let node = localNetwork.findNodeById(req.body.id);
	node.reboot(localNetwork.settings.username, localNetwork.settings.password);
	//
	res.json(node);
});

router.post('/api/shutdown', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;
	//
	let node = localNetwork.findNodeById(req.body.id);
	node.reboot(localNetwork.settings.username, localNetwork.settings.password);
	//
	res.json(node);
});

//block
router.post('/api/block/wakeup', function (req, res) {
	console.log('wake block on lan: ');

	let foundBlock = localNetwork.findBlockById(req.body.id);

	foundBlock.nodes.forEach(function (node) {
		node.wakeup();
	});
	//
	res.json(foundBlock);
});

router.post('/api/block/reboot', function (req, res) {
	console.log('reboot block: ');
	let localNetwork = res.app.locals.localNetwork;
	//

	let foundBlock = localNetwork.findBlockById(req.body.id);

	foundBlock.nodes.forEach(function (node) {
		node.reboot(localNetwork.settings.username, localNetwork.settings.password);
	});
	//
	res.json(foundBlock);
});

router.post('/api/block/shutdown', function (req, res) {
	console.log('shutdown block: ');
	let localNetwork = res.app.locals.localNetwork;
	//

	let foundBlock = localNetwork.findBlockById(req.body.id);

	foundBlock.nodes.forEach(function (node) {
		node.reboot(localNetwork.settings.username, localNetwork.settings.password);
	});
	//
	res.json(foundBlock);
});

//awp
router.post('/api/awp/wakeup', function (req, res) {
	console.log('wake awp on lan: ');

	let foundAWP = localNetwork.findAwpById(req.body.id);

	foundAWP.nodes.forEach(function (node) {
		node.wakeup();
	});
	//
	res.json(foundAWP);
});

router.post('/api/awp/reboot', function (req, res) {
	console.log('reboot awp: ');
	let localNetwork = res.app.locals.localNetwork;
	//

	let foundAWP = localNetwork.findAwpById(req.body.id);

	foundAWP.nodes.forEach(function (node) {
		node.reboot(localNetwork.settings.username, localNetwork.settings.password);
	});
	//
	res.json(foundAWP);
});

router.post('/api/awp/shutdown', function (req, res) {
	console.log('shutdown awp: ');
	let localNetwork = res.app.locals.localNetwork;
	//

	let foundAWP = localNetwork.findAwpById(req.body.id);

	foundAWP.nodes.forEach(function (node) {
		node.reboot(localNetwork.settings.username, localNetwork.settings.password);
	});
	//
	res.json(foundAWP);
});
//pjlink api calls

router.post('/api/pjpoweron', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;
	let pjBeamers = res.app.locals.pjBeamers;
	console.log('pjlink poweron: ');
	let id = req.body.id;
	//console.log(node);      // your JSON
	//

	pjBeamers[id].powerOn(function (err) {
		if (err) {
			console.log('error turning on', err);
			return;
		}
	});
	//
	res.json(id);
});

router.post('/api/pjpoweroff', function (req, res) {
	let localNetwork = res.app.locals.localNetwork;
	let pjBeamers = res.app.locals.pjBeamers;
	console.log('shutdown: ');
	let id = req.body.id;
	//console.log(node);      // your JSON
	//
	pjBeamers[id].powerOff(function (err) {
		if (err) {
			console.log('error turning off', err);
			return;
		}
	});
	//
	res.json(id);
});

module.exports = router;

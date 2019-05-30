var express = require('express');
var router = express.Router();

const fs = require('fs');


/* GET home page. */
router.get('/', function(req, res) {;
	let rawdata = fs.readFileSync('network.json');
	let networkScheme = JSON.parse(rawdata);
	console.log(networkScheme);
	ssh = networkScheme.ssh;
	blocks = networkScheme.blocks;
	res.json(networkScheme);
});

module.exports = router;

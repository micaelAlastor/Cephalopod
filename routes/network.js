var express = require('express');
var router = express.Router();
//pjlink
var pjlink = require('pjlink');

const fs = require('fs');
const find = require('local-devices');

/* GET home page. */
router.get('/', function(req, res) {;
	let rawdata = fs.readFileSync('network.json');
	let networkScheme = JSON.parse(rawdata);
	console.log(networkScheme);
	ssh = networkScheme.ssh;
	localNetwork.blocks = networkScheme.blocks;
	res.json(networkScheme);

	localNetwork.blocks.forEach(function(eachBlock){
		if(eachBlock.type === "pc"){
			eachBlock.nodes.forEach(function(eachPc){
				find(eachPc.ip).then(device=>{
					eachPc.mac = device.mac;
				})
			})
		}
		else if(eachBlock.type === "pj"){
			eachBlock.nodes.forEach(function(eachProj){
				if(!eachProj.beamer){
					eachProj.beamer = new pjlink(eachProj.ip, 4352, "");
				}
			})
		}
	});
	localNetwork.findNodeByIP = function(nodeIP){
		let node = null;
		localNetwork.blocks.forEach(function(eachBlock){
			eachBlock.nodes.forEach(function(eachNode){
				if(eachNode.ip === nodeIP){
					node = eachNode;
				}
			})
		});
		return node;
	}
});

module.exports = router;

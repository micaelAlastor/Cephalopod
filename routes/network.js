var express = require('express');
var router = express.Router();
//pjlink
var pjlink = require('pjlink');

const fs = require('fs');
const find = require('local-devices');
const uuidv4 = require('uuid/v4');

/* GET home page. */
router.get('/', function (req, res) {
    let rawdata = fs.readFileSync('network.json');
    let networkScheme = {ssh: {}, blocks:[]};
    try {
        networkScheme = JSON.parse(rawdata);
    } catch (e) {
        console.log(e);
    }
    console.log(networkScheme);

    ssh = networkScheme.ssh;
    localNetwork.blocks = networkScheme.blocks;

    res.json({cblocks: localNetwork.blocks});

    localNetwork.blocks.forEach(function (eachBlock) {
        if (eachBlock.nodestype === "pj") {
            eachBlock.nodes.forEach(function (eachProj) {
                if (!eachProj.beamer) {
                    eachProj.beamer = new pjlink(eachProj.ip, 4352, "");
                }
            })
        }
    });
});

router.post('/', function (req, res, next) {
   let newBlock = req.body.cblock;
   if(newBlock){
       newBlock.id = uuidv4();
       localNetwork.blocks.push(newBlock);
   }
   res.send({cblocks: newBlock});
});

module.exports = router;

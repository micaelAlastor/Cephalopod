var express = require('express');
var router = express.Router();
//pjlink
var pjlink = require('pjlink');

const fs = require('fs');
const find = require('local-devices');
const uuidv4 = require('uuid/v4');

/* GET home page. */
router.get('/', function(req, res) {
    let rawdata = fs.readFileSync('settings.json');
    let networkScheme = JSON.parse(rawdata);
    console.log(networkScheme);
    localNetwork.blocks = networkScheme.blocks;

    let promises = [];
    localNetwork.blocks.forEach(function(eachBlock){
        if(eachBlock.type === "pc"){
            eachBlock.nodes.forEach(function(eachPc){
                promises.push(find(eachPc.ip));
            })
        }
        Promise.all(promises).then(function(devicesInfo){
            devicesInfo.forEach(function(deviceInfo){
                let node = localNetwork.findNodeByIp(deviceInfo.ip);
                node.mac = deviceInfo.mac;
            });

            let json = JSON.stringify(networkScheme); //convert it back to json
            fs.writeFile('network.json', json, 'utf8', function(){console.log('network.json is updated')});
        });
    });

    res.json(networkScheme);
});

module.exports = router;

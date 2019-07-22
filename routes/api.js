//pjlink
var pjlink = require('pjlink');
//
const fs = require('fs');
const find = require('local-devices');
const uuidv4 = require('uuid/v4');

const API = module.exports.API = {
    config: {
        getConfig: function (req, res) {
            res.json({config: [{id: 1}]});
        },

        postConfig: function (req, res) {
            let json = JSON.stringify(localNetwork); //convert it back to json
            fs.writeFile('network.json', json, 'utf8', function(){console.log('network.json is updated')});
        }
    },
    blocks: {
        getBlocks: function (req, res) {
            let rawdata = fs.readFileSync('network.json');
            let networkScheme = {ssh: {}, blocks: []};
            try {
                networkScheme = JSON.parse(rawdata);
            } catch (e) {
                console.log(e);
            }
            console.log(networkScheme);

            ssh = networkScheme.ssh;
            localNetwork.blocks = networkScheme.blocks;

            res.json({cblocks: localNetwork.blocks});

            /*localNetwork.blocks.forEach(function (eachBlock) {
                if (eachBlock.nodestype === "pj") {
                    eachBlock.nodes.forEach(function (eachProj) {
                        if (!eachProj.beamer) {
                            eachProj.beamer = new pjlink(eachProj.ip, 4352, "");
                        }
                    })
                }
            });*/
        },

        postBlock: function (req, res, next) {
            let newBlock = req.body.cblock;
            if (newBlock) {
                newBlock.id = uuidv4();
                newBlock.awps = [];
                localNetwork.blocks.push(newBlock);
            }
            res.send({cblocks: newBlock});
        }
    },

    awps: {
        postAwp: function (req, res, next) {
            let newAwp = req.body.cawp;
            if (newAwp) {
                newAwp.id = uuidv4();
                newAwp.nodes = [];
                //localNetwork.blocks.push(newAwp);
            }
            res.send({cawps: newAwp});
        }
    }
};

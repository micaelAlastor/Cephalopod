//pjlink
var pjlink = require('pjlink');
//ip to mac
const find = require('local-devices');
//
const fs = require('fs');
const uuidv4 = require('uuid/v4');
//class model
const Network = require('../structure').Network;
const Block = require('../structure').Block;
const Awp = require('../structure').Awp;
const Node = require('../structure').Node;


function findAwpForNode(node) {
    let localNetwork = res.app.locals.localNetwork;
    let block = localNetwork.blocks.find(function (block) {
        return block.id === node.block;
    });
    let awp = block.awps.find(function (awp) {
        return awp.id === node.awp;
    });
    return awp;
}

const API = module.exports.API = {
    config: {
        getConfig: function (req, res) {
            res.json({config: [{id: 1}]});
        },

        postConfig: function (req, res) {
            let localNetwork = res.app.locals.localNetwork;
            let json = JSON.stringify(localNetwork); //convert it back to json
            fs.writeFile('network.json', json, 'utf8', function () {
                console.log('network.json is updated')
            });
        }
    },
    blocks: {
        //reading network.json
        getBlocks: function (req, res) {
            let localNetwork = res.app.locals.localNetwork;
            let rawdata = fs.readFileSync('network.json');
            let networkScheme = {ssh: {}, blocks: []};
            try {
                networkScheme = JSON.parse(rawdata);
            } catch (e) {
                console.log(e);
            }
            console.log(networkScheme);

            //ssh = networkScheme.ssh;
            localNetwork.acceptData(networkScheme);

            res.json({cblocks: networkScheme.blocks});
        },

        postBlock: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let blockData = req.body.cblock;
            if (blockData) {
                let newBlock = new Block(blockData);
                localNetwork.pushBlock(newBlock);
            }
            res.send({cblocks: blockData});
        },

        putBlock: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let changedBlock;
            let data = req.body.cblock;
            if (data) {
                changedBlock = localNetwork.findBlockById(req.params._id);
                changedBlock.name = data.name;
                res.send({cblocks: changedBlock});
            } else
                console.log('Error: no block data provided');
        }
    },

    awps: {
        postAwp: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let awpData = req.body.cawp;
            if (awpData) {
                let block = localNetwork.findBlockById(awpData.block);
                if (block) {
                    let newAwp = new Awp(awpData);
                    block.pushAwp(newAwp);
                }
            }
            res.send({cawps: awpData});
        },

        putAwp: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let changedAwp;
            let data = req.body.cawp;
            if (data) {
                changedAwp = localNetwork.findAwpById(awpData.block, awpData.id);

                changedAwp.name = data.name;
                res.send({cwps: changedAwp});
            } else
                console.log('Error: no awp data provided');
        }
    },
    nodes: {
        postNode: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let pjBeamers = res.app.locals.pjBeamers;
            let newNode = req.body.cnode;
            if (newNode) {
                newNode.id = uuidv4();
                let awp = findAwpForNode(newNode, localNetwork);
                if (awp) {
                    if (awp.nodestype === 'pj') {
                        pjBeamers[newNode.id] = new pjlink(newNode.ip, 4352, "");
                    }
                    awp.nodes.push(newNode);
                }

            }
            res.send({cnodes: newNode});
        },
        putNode: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let changedNode;
            let data = req.body.cnode;
            if (data) {
                let awp = findAwpForNode(data, localNetwork);
                if (awp) {
                    changedNode = awp.nodes.find(function (node) {
                        return node.id === req.params._id;
                    });
                    changedNode.name = data.name;
                    changedNode.ip = data.ip;
                    changedNode.mac = data.mac;
                    changedNode.powerstate = data.powerstate;

                    find(changedNode.ip).then(device => {
                        changedNode.mac = device.mac;
                    }).catch(function (error) {
                        changedNode.mac = '00:00:00:00:00:00';
                    }).finally(function () {
                        res.send({cnodes: changedNode});
                    });
                }
            } else
                console.log('Error: no node data provided');
        },
    }
};

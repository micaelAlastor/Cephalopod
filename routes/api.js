//pjlink
var pjlink = require('pjlink');
//ip to mac
const findLocalDevice = require('local-devices');
//
const fs = require('fs');
const uuidv4 = require('uuid/v4');
//class model
const Network = require('../structure').Network;
const Block = require('../structure').Block;
const Awp = require('../structure').Awp;
const Node = require('../structure').Node;



const API = module.exports.API = {
    config: {
        getConfig: function (req, res) {
            res.json({config: [{id: 1}]});
        },

        saveConfig: function (req, res) {
            let localNetwork = res.app.locals.localNetwork;
            let json = JSON.stringify(localNetwork); //convert it back to json
            fs.writeFile('network.json', json, 'utf8', function () {
                console.log('network.json is updated')
            });
            res.json({config: [{id: 1}]});
        }
    },
    blocks: {
        getBlocks: function (req, res) {
            let localNetwork = res.app.locals.localNetwork;
            res.json({cblocks: localNetwork.blocks});
        },

        postBlock: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let blockData = req.body.cblock;
            let newBlock;
            if (blockData) {
                newBlock = new Block(blockData);
                localNetwork.pushBlock(newBlock);
            }
            res.send({cblocks: newBlock});
        },

        putBlock: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let changed;
            let data = req.body.cblock;
            if (data) {
                changed = localNetwork.findBlockById(req.params._id);
                changed.name = data.name;
                changed.position = data.position;
                changed.height = data.height;
                changed.width = data.width;
                changed.x = data.x;
                changed.y = data.y;
                res.send({cblocks: changed});
            } else
                console.log('Error: no block data provided');
        },

        deleteBlock: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            localNetwork.deleteBlockById(req.params._id);
            res.send({cblocks: {}});
        }
    },

    awps: {
        postAwp: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let awpData = req.body.cawp;
            let newAwp;
            if (awpData) {
                let block = localNetwork.findBlockById(awpData.block);
                if (block) {
                    newAwp = new Awp(awpData);
                    block.pushAwp(newAwp, localNetwork);
                }
            }
            res.send({cawps: newAwp});
        },

        putAwp: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let changed;
            let data = req.body.cawp;
            if (data) {
                changed = localNetwork.findAwpById(req.params._id);
                changed.name = data.name;
                changed.position = data.position;
                changed.height = data.height;
                changed.width = data.width;
                changed.x = data.x;
                changed.y = data.y;
                res.send({cawps: changed});
            } else
                console.log('Error: no awp data provided');
        },

        deleteAwp: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            localNetwork.deleteAwpById(req.params._id);
            res.send({cawps: {}});
        }
    },
    nodes: {
        postNode: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let pjBeamers = res.app.locals.pjBeamers;
            let data = req.body.cnode;
            let newNode;
            if (data) {
                let awp = localNetwork.findAwpById(data.awp);
                if (awp) {
                    newNode = new Node(data);
                    awp.pushNode(newNode, localNetwork);
                    if (awp.nodestype === 'pj') {
                        pjBeamers[data.id] = new pjlink(data.ip, localNetwork.settings.pjlinkPort, "");
                    }
                }

            }
            res.send({cnodes: newNode});
        },
        putNode: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            let changedNode;
            let data = req.body.cnode;

            changedNode = localNetwork.findNodeById(req.params._id);
            changedNode.name = data.name;
            changedNode.ip = data.ip;
            changedNode.mac = data.mac;
            changedNode.powerstate = data.powerstate;
            changedNode.special = data.special;

            /*findLocalDevice(changedNode.ip).then(device => {
                if(device)
                    changedNode.mac = device.mac;
                else
                    changedNode.mac = data.mac;
            }).catch(function (error) {
                changedNode.mac = data.mac;
            }).finally(function () {
                res.send({cnodes: changedNode});
            });*/

            findLocalDevice(changedNode.ip).then(device => {
                if(device)
                    changedNode.mac = device.mac;
            }, error => {
                console.log(error);
                changedNode.mac = data.mac;
            });

            res.send(data);
        },

        deleteNode: function (req, res, next) {
            let localNetwork = res.app.locals.localNetwork;
            localNetwork.deleteNodeById(req.params._id);
            res.send({cnodes: {}});
        }
    }
};

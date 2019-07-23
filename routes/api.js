//pjlink
var pjlink = require('pjlink');
//ip to mac
const find = require('local-devices');
//
const fs = require('fs');
const uuidv4 = require('uuid/v4');

function findAwpForNode(node) {
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
            let json = JSON.stringify(localNetwork); //convert it back to json
            fs.writeFile('network.json', json, 'utf8', function () {
                console.log('network.json is updated')
            });
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
        },

        putBlock: function (req, res, next) {
            let changedBlock;
            let data = req.body.cblock;
            if (data) {
                changedBlock = localNetwork.blocks.find(function(block){
                    return block.id === req.params._id;
                });
                changedBlock.name = data.name;
                res.send({cblocks: changedBlock});
            } else
                console.log('Error: no block data provided');
        }
    },

    awps: {
        postAwp: function (req, res, next) {
            let newAwp = req.body.cawp;
            if (newAwp) {
                newAwp.id = uuidv4();
                newAwp.nodes = [];
                let block = localNetwork.blocks.find(function (block) {
                    return block.id === newAwp.block;
                });
                if (block)
                    block.awps.push(newAwp);
            }
            res.send({cawps: newAwp});
        },

        putAwp: function (req, res, next) {
            let changedAwp;
            let data = req.body.cawp;
            if (data) {
                let block = localNetwork.blocks.find(function (block) {
                    return block.id === data.block;
                });
                changedAwp = block.awps.find(function (awp) {
                    return awp.id === req.params._id;
                });

                changedAwp.name = data.name;
                res.send({cwps: changedAwp});
            } else
                console.log('Error: no awp data provided');
        }
    },
    nodes: {
        postNode: function (req, res, next) {
            let newNode = req.body.cnode;
            if (newNode) {
                newNode.id = uuidv4();
                let awp = findAwpForNode(newNode);
                if (awp)
                    awp.nodes.push(newNode);
            }
            res.send({cnodes: newNode});
        },
        putNode: function (req, res, next) {
            let changedNode;
            let data = req.body.cnode;
            if (data) {
                let awp = findAwpForNode(data);
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

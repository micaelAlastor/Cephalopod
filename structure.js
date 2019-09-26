const uuidv4 = require('uuid/v4');

//ssh
var sequest = require('sequest');

//wake on lan
var wol = require('wake_on_lan');

//pjlink
var pjlink = require('pjlink');

//node is either single pc or projector
let Node = module.exports.Node = class Node {
    constructor(nodeData) {
        this.position = 0;
        this.block = nodeData.block;
        this.awp = nodeData.awp;
        this.name = nodeData.name;
        this.ip = nodeData.ip;
        this.mac = nodeData.mac;
        this.powerstate = nodeData.powerstate;
        this.nodestype = nodeData.nodestype;
        this.special = nodeData.special;
        //if we create data from json so id is already there
        if(nodeData.id) {
            this.id = nodeData.id;
        }
        //if we create new node for client request
        else {
            this.id = uuidv4();
        }
    }

    wakeup() {
        wol.wake(this.mac);
    }

    reboot(username, password) {
        let err;
        sequest(username + '@' + this.ip,
            {
                command: 'sudo shutdown --reboot now "System goes on reboot now"',
                username: username,
                password: password
            },
            function (e, stdout) {
                if (e) {
                    console.log(e);
                    err = e;
                }
                console.log(stdout.split('\n'))
            });
        return err;
    }

    shutdown(username, password) {
        let err;
        sequest(username + '@' + this.ip,
            {
                command: 'sudo shutdown -P now "System goes down now"',
                username: username,
                password: password
            },
            function (e, stdout) {
                if (e) {
                    console.log(e);
                    err = e;
                }
                console.log(stdout.split('\n'))
            });
        return err;
    }
};

//automated workplace (either set of pc or projectors)
let Awp = module.exports.Awp = class Awp {
    constructor(data, network) {
        this.position = data.position;
        this.x = data.x;
        this.y = data.y;
        this.height = data.height;
        this.width = data.width;
        this.nodes = [];
        this.name = data.name;
        this.block = data.block;
        this.nodestype = data.nodestype;
        //if we create data from json so id is already there and awp has its nodes
        if(data.id){
            let self = this;
            this.id = data.id;
            data.nodes.forEach(function(nodeData){
                let newNode = new Node(nodeData);
                self.pushNode(newNode, network);
            })
        }
        //if we create new awp for client request
        else {
            this.id = uuidv4();
        }
    }

    recalcNodesPosition(){
        this.nodes.forEach(function(node, index){
            node.position = index;
        })
    }

    pushNode(node, network) {
        if(this.nodes.length > 0) {
            node.position = this.nodes[this.nodes.length - 1].position + 1;
        }
        node.nodestype = this.nodestype;
        this.nodes.push(node);
        network.pushNode(node);
    }
};

//block of workplaces
let Block = module.exports.Block = class Block {
    constructor(data, network) {
        this.position = data.position;
        this.x = data.x;
        this.y = data.y;
        this.height = data.height;
        this.width = data.width;
        this.awps = [];
        this.name = data.name;

        //if we create data from json so id is already there and block has workplaces
        if(data.id){
            let self = this;
            this.id = data.id;
            data.awps.forEach(function(awpData){
                let newAwp = new Awp(awpData, network);
                self.pushAwp(newAwp, network);
            })
        }
        //if we create new block for client request
        else {
            this.id = uuidv4();
        }
    }

    recalcAwpsPosition(){
        this.awps.forEach(function(awp, index){
            awp.position = index;
        })
    }

    pushAwp(awp, network) {
        if(this.awps.length > 0) {
            awp.position = this.awps[this.awps.length - 1].position + 1;
        }
        this.awps.push(awp);
        network.pushAwp(awp);
    }
};


let Network = module.exports.Network = class LocalNetwork {
    constructor() {
        this.blocks = [];
        this.awps = [];
        this.nodes = [];
    }

    acceptData(networkData) {
        this.blocks = [];

        let self = this;
        if(networkData) {
            networkData.blocks.forEach(function(blockData){
                let newBlock = new Block(blockData, self);
                self.pushBlock(newBlock);
            })
        }
    }

    recalcBlocksPosition(){
        this.blocks.forEach(function(block, index){
            block.position = index;
        })
    }

    pushBlock(block) {
        if(this.blocks.length > 0) {
            block.position = this.blocks[this.blocks.length - 1].position + 1;
        }
        this.blocks.push(block);
    }

    pushAwp(awp) {
        this.awps.push(awp);
    }

    pushNode(node) {
        this.nodes.push(node);
    }

    deleteBlockById(id) {
        for( let i = 0; i < this.blocks.length; i++){
            if ( this.blocks[i].id === id) {
                this.blocks.splice(i, 1);
            }
        }
    }

    deleteAwpById(id) {
        let toDelete = this.findAwpById(id);
        let parent = this.findBlockById(toDelete.block);

        for( let i = 0; i < parent.awps.length; i++){
            if ( parent.awps[i].id === id) {
                parent.awps.splice(i, 1);
            }
        }

        for( let i = 0; i < this.awps.length; i++){
            if ( this.awps[i].id === id) {
                this.awps.splice(i, 1);
            }
        }
    }

    deleteNodeById(id) {
        let toDelete = this.findNodeById(id);
        let parent = this.findAwpById(toDelete.awp);

        for( let i = 0; i < parent.nodes.length; i++){
            if ( parent.nodes[i].id === id) {
                parent.nodes.splice(i, 1);
            }
        }

        for( let i = 0; i < this.nodes.length; i++){
            if ( this.nodes[i].id === id) {
                this.nodes.splice(i, 1);
            }
        }
    }

    findBlockById(block_id) {
        return this.blocks.find(function (block) {
            return block.id === block_id;
        });
    }

    findAwpById(awp_id) {
        return this.awps.find(function (awp) {
            return awp.id === awp_id;
        });
    }

    findNodeById(node_id) {
        return this.nodes.find(function (node) {
            return node.id === node_id;
        });
    }
};

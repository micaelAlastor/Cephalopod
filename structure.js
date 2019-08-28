const uuidv4 = require('uuid/v4');

//node is either single pc or projector
let Node = module.exports.Node = class Node {
    constructor(nodeData) {
        this.block = nodeData.block;
        this.awp = nodeData.awp;

        this.name = nodeData.name;
        this.ip = nodeData.ip;
        this.mac = nodeData.mac;
        this.powerstate = nodeData.powerstate;
        this.nodestype = nodeData.nodestype;
        //if we create data from json so id is already there
        if(nodeData.id) {
            this.id = nodeData.id;
        }
        //if we create new node for client request
        else {
            this.id = uuidv4();
        }
    }
};

//automated workplace (either set of pc or projectors)
let Awp = module.exports.Awp = class Awp {
    constructor(awpData, network) {
        this.nodes = [];
        this.name = awpData.name;
        this.block = awpData.block;
        this.nodestype = awpData.nodestype;
        //if we create data from json so id is already there and awp has its nodes
        if(awpData.id){
            let self = this;
            this.id = awpData.id;
            awpData.nodes.forEach(function(nodeData){
                let newNode = new Node(nodeData);
                self.pushNode(newNode, network);
            })
        }
        //if we create new awp for client request
        else {
            this.id = uuidv4();
        }
    }

    pushNode(node, network) {
        node.nodestype = this.nodestype;
        this.nodes.push(node);
        network.pushNode(node);
    }
};

//block of workplaces
let Block = module.exports.Block = class Block {
    constructor(blockData, network) {
        this.awps = [];
        this.name = blockData.name;

        //if we create data from json so id is already there and block has workplaces
        if(blockData.id){
            let self = this;
            this.id = blockData.id;
            blockData.awps.forEach(function(awpData){
                let newAwp = new Awp(awpData, network);
                self.pushAwp(newAwp, network);
            })
        }
        //if we create new block for client request
        else {
            this.id = uuidv4();
        }
    }

    pushAwp(awp, network) {
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

    pushBlock(block) {
        this.blocks.push(block);
    }

    pushAwp(awp) {
        this.awps.push(awp);
    }

    pushNode(node) {
        this.nodes.push(node);
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

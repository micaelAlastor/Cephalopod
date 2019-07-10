import EmberObject from '@ember/object';
import { A } from '@ember/array';
import Block from "./block";

export default EmberObject.extend({
  blocks: A([]),
  nodes: A([]),

  acceptJson(json) {
    let self = this;
    json.blocks.forEach(function(blockJson){
      let block = Block.create({});
      block.set('scheme', self);
      block.acceptJson(blockJson);
      self.addBlock(block);
    });
  },

  addBlock(block) {
    this.blocks.pushObject(block);
  },

  acceptNodeChanges(json) {
    let found = this.nodes.find(function(updatedNode){
      return updatedNode.get('ip') === json.ip;
    });
    if(found){
      //console.log('found');
      found.setProperties(json);
    }
  }
});

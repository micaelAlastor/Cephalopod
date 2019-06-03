import EmberObject from '@ember/object';
import { A } from '@ember/array';
import Block from "./block";

export default EmberObject.extend({
  blocks: A([]),

  acceptJson(json) {
    let self = this;
    json.blocks.forEach(function(blockJson){
      let block = Block.create({});
      block.acceptJson(blockJson);
      self.addBlock(block);
    });
  },

  addBlock(block) {
    this.blocks.pushObject(block);
  }
});

import EmberObject from '@ember/object';
import {A} from '@ember/array';
import Node from "./node";

export default EmberObject.extend({
  name: '',
  type: '',
  pc: false,
  pj: false,
  nodes: null,

  acceptJson(json) {
    this.set('name', json.name);
    this.set('type', json.type);
    if(json.type === 'pc')
      this.set('pc', true);
    if(json.type === 'pj')
      this.set('pj', true);
    this.set('nodes', A());

    let self = this;
    json.nodes.forEach(function (nodeJson) {
      let node = Node.create({type: self.type});
      node.acceptJson(nodeJson);
      self.addNode(node);
    });
  },

  addNode(node) {
    this.nodes.pushObject(node);
    this.scheme.nodes.pushObject(node);
  }
});

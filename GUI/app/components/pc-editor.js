import NodeEditor from './node-editor';

export default NodeEditor.extend({
  classNames: ['nodeEditor', 'pcEditor'],
  
  actions: {
    deleteNode: function () {
      this.node.destroyRecord();
    }
  }
});

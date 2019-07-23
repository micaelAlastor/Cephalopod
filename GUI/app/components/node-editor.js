import Component from '@ember/component';

export default Component.extend({
  node: null,

  actions: {
    saveNode: function(name){
      this.node.save();
    }
  }
});

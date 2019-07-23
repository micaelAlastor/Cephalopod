import Component from '@ember/component';

export default Component.extend({
  node: null,

  actions: {
    saveName: function(name){
      this.node.set('name', name);
    },
    saveIp: function(ip){
      this.node.set('ip', ip);
    }
  }
});

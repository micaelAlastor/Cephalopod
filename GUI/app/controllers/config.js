import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveConfig: function () {
      this.store.findRecord('config', 1).then(function(config) {
        config.save();
      });
    },
    addBlock: function () {
      let block = this.store.createRecord('cblock');
      block.save();
    },
    addAwpPc: function (block) {
      let awp = this.store.createRecord('cawp', {nodestype: 'pc', block: block});
      awp.save();
    },
    addAwpPj: function (block) {
      let awp = this.store.createRecord('cawp', {nodestype: 'pj', block: block});
      awp.save();
    },
    addNode: function (awp) {
      let node = this.store.createRecord('cnode', {awp: awp});
      node.save();
    },
  }
});

import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  sortedBlocks: computed('model', function() {
    return this.model.sortBy('position');
  }),

  actions: {
    loadConfig: function () {
      let self = this;
      this.model.forEach(function(eachBlock){
        eachBlock.unloadRecord();
      });
      $.post('/api/reload', {reload: true}, function (response) {
        self.get('target').send('refresh');
        self.get('notifications').success('Конфигурация сети загружена из файла', {
          autoClear: true
        });
      }, 'json');
    },
    saveConfig: function () {
      let self = this;
      this.store.findRecord('config', 1).then(function(config) {
        config.save();
        self.get('notifications').success('Конфигурация сети сохранена в файл', {
          autoClear: true
        });
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
    addPc: function (awp) {
      let pc = this.store.createRecord('cnode', {name: 'Компьютер', awp: awp, block: awp.block});
      pc.save();
    },
    addPj: function (awp) {
      let pj = this.store.createRecord('cnode', {name: 'Проектор', awp: awp, block: awp.block});
      pj.save();
    },
    reorderBlocks: function (itemModels, draggedModel) {
      console.log('reorder blocks');

      itemModels.forEach(function(block, index){
        block.set('position', index);
        block.save();
      });
      Ember.notifyPropertyChange(this, 'model');
    }
  }
});

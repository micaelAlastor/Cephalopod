import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  /*sortedBlocks: computed('model', function() {
    return this.get('model.blocks').sortBy('position');
  }),*/

  actions: {
    loadConfig: function () {
      let self = this;
      this.get('model').forEach(function(eachBlock){
        eachBlock.unloadRecord();
      });
      $.post('/api/reload', {reload: true}, function (response) {
        self.send('refreshRoute');
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
      //this.get('model.blocks').pushObject(block);
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
      //Ember.notifyPropertyChange(this, 'model');
    },
    blockUp: function (block) {
      if(block.position > 0) {
        let blocks = this.get('model.blocks');
        blocks[block.position - 1].position = block.position;
        block.position = block.position - 1;
        block.save();
        blocks[block.position - 1].save();
        //Ember.notifyPropertyChange(this, 'model');
      }
    }
  }
});

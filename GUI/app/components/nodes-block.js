import Component from '@ember/component';

export default Component.extend({
  classNames: ['nodes-block'],
  actions: {
    blockWakeup(block) {
      $.post('/api/block/wakeup', block.getProperties('id'), function (response) {
        // Do something with the request
      }, 'json');
    }
  }
});

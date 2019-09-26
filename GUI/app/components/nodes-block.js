import Component from '@ember/component';

export default Component.extend({
  classNames: ['nodes-block'],

  didRender() {
    this.$().css({
      left: `${this.get('block.x')}px`,
      top: `${this.get('block.y')}px`,
      height: `${this.get('block.height')}px`,
      width: `${this.get('block.width')}px`,
    });
  },

  actions: {
    blockWakeup(block) {
      $.post('/api/block/wakeup', block.getProperties('id'), function (response) {
        // Do something with the request
      }, 'json');
    },
    blockReboot(block) {
      $.post('/api/block/reboot', block.getProperties('id'), function (response) {
        // Do something with the request
      }, 'json');
    },
    blockShutdown(block) {
      $.post('/api/block/shutdown', block.getProperties('id'), function (response) {
        // Do something with the request
      }, 'json');
    }
  }
});

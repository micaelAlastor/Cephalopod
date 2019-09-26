import Component from '@ember/component';

export default Component.extend({
  classNames: ['nodes-block'],

  didRender() {
    this.$().css({
      left: `${this.get('awp.x')}px`,
      top: `${this.get('awp.y')}px`,
      height: `${this.get('awp.height')}px`,
      width: `${this.get('awp.width')}px`,
    });
  },

  actions: {
    awpWakeup(awp) {
      $.post('/api/awp/wakeup', awp.getProperties('id'), function (response) {
        // Do something with the request
      }, 'json');
    },
    awpReboot(awp) {
      $.post('/api/awp/reboot', awp.getProperties('id'), function (response) {
        // Do something with the request
      }, 'json');
    },
    awpShutdown(awp) {
      $.post('/api/awp/shutdown', awp.getProperties('id'), function (response) {
        // Do something with the request
      }, 'json');
    }
  }
});

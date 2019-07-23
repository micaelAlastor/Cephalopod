import Component from '@ember/component';

export default Component.extend({
  classNames: ['nodes-block'],
  actions: {
    addPc: function () {
      this.sendAction('addPc', this.get('awp'));
    },
    addPj: function () {
      this.sendAction('addPj', this.get('awp'));
    }
  }
});
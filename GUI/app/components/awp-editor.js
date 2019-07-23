import Component from '@ember/component';

export default Component.extend({
  classNames: ['awp-editor'],
  actions: {
    saveAwp: function() {
      this.awp.save();
    },
    addPc: function () {
      this.sendAction('addPc', this.get('awp'));
    },
    addPj: function () {
      this.sendAction('addPj', this.get('awp'));
    }
  }
});

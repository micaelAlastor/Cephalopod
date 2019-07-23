import Component from '@ember/component';

export default Component.extend({
  classNames: ['nodes-block'],
  actions: {
    addAwpPc: function () {
      this.sendAction('addAwpPc', this.get('block'));
    },
    addAwpPj: function () {
      this.sendAction('addAwpPj', this.get('block'));
    },
    addPc: function (awp) {
      this.sendAction('addPc', awp);
    },
    addPj: function (awp) {
      this.sendAction('addPj', awp);
    }
  }
});
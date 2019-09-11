import Component from '@ember/component';

export default Component.extend({
  classNames: ['block-editor'],
  grid: [20, 10],
  resizeBlock: function(direction, { width: newWidth, height: newHeight }, { width: deltaX, height: deltaY }, element) {
    this.get('block').set('width', newWidth);
    this.get('block').set('height', newHeight);
    console.log('resized');
  },
  actions: {
    blockUp: function() {
      this.send('blockUp', this.get('block'));
    },
    saveBlock: function() {
      this.block.save();
    },
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

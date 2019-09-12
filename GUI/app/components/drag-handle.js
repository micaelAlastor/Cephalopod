import Component from '@ember/component';

export default Component.extend({
  classNames:['drag-handle'],

  mouseDown(e) {
    //e.target.parentNode.setAttribute('draggable', 'true');
    this.onStartDrag();
  },

  mouseUp(e) {
    //e.target.parentNode.setAttribute('draggable', 'false')
    this.onStopDrag();
  }
});

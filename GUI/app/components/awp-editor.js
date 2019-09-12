import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  draggableObject: service(),
  classNames: ['awp-editor'],
  attributeBindings: ['draggable'],
  draggable: false,
  awp: null,
  grid: [10, 10],

  didRender() {
    this.$().css({
      left: `${this.get('awp.x')}px`,
      top: `${this.get('awp.y')}px`,
    });
  },

  dragStart(e) {
    if(this.draggable) {
      this.draggableObject.drag(this.get('awp'), null, this.get('grid'));
      //this.get('dropZone').dragStart();
      e.originalEvent.dropEffect = "move";
      //
      let x = this.get('awp.x') - e.originalEvent.clientX;
      let y = this.get('awp.y') - e.originalEvent.clientY;
      //
      console.log('awp drag started from ' + 'x = ' + this.get('awp.x') + ', y = ' + this.get('awp.y'));
      //
      e.originalEvent.dataTransfer.setData("position", `${x},${y}`);
    }
  },

  dragEnd(e) {
    console.log('awp drag ended with ' + 'x = ' + this.get('awp.x') + ', y = ' + this.get('awp.y'));

    this.$().css({
      left: `${this.get('awp.x')}px`,
      top: `${this.get('awp.y')}px`,
    });

    this.set('draggable', false);
    //this.get('dropZone').dragStop();
    this.awp.save();
  },

  actions: {
    resizeAWP: function (direction, {width: newWidth, height: newHeight}, {width: deltaX, height: deltaY}, element) {
      this.get('awp').set('width', newWidth);
      this.get('awp').set('height', newHeight);
      console.log('awp resized');

      this.awp.save();
    },
    makeDraggable: function() {
      this.set('draggable', true);
    },
    makeStill: function() {
      this.set('draggable', false);
    },
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

import Component from '@ember/component';
import Ember from 'ember';
import {inject as service} from '@ember/service';

export default Component.extend({
  draggableObject: service(),
  classNames: ['block-editor'],
  attributeBindings: ['draggable'],
  draggable: false,
  block: null,
  grid: [20, 20],

  didRender() {
    this.$().css({
      left: `${this.get('block.x')}px`,
      top: `${this.get('block.y')}px`,
    });
  },

  dragStart(e) {
    if(this.draggable) {
      this.draggableObject.drag(this.get('block'), null, this.get('grid'));
      //this.get('dropZone').dragStart();
      e.originalEvent.dropEffect = "move";
      //
      let x = this.get('block.x') - e.originalEvent.clientX;
      let y = this.get('block.y') - e.originalEvent.clientY;
      //
      console.log('drag started from ' + 'x = ' + this.get('block.x') + ', y = ' + this.get('block.y'));
      //
      e.originalEvent.dataTransfer.setData("position", `${x},${y}`);
    }
  },

  dragEnd(e) {
    if(this.draggable) {
      console.log('drag ended with ' + 'x = ' + this.get('block.x') + ', y = ' + this.get('block.y'));

      this.$().css({
        left: `${this.get('block.x')}px`,
        top: `${this.get('block.y')}px`,
      });

      this.set('draggable', false);
      //this.get('dropZone').dragStop();
      this.block.save();
    }
  },

  actions: {
    resizeBlock: function (direction, {width: newWidth, height: newHeight}, {width: deltaX, height: deltaY}, element) {
      this.get('block').set('width', newWidth);
      this.get('block').set('height', newHeight);
      console.log('resized');

      this.block.save();
    },
    makeDraggable: function() {
      this.set('draggable', true);
    },
    makeStill: function() {
      this.set('draggable', false);
    },
    saveBlock: function () {
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

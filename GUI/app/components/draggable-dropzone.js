import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  draggableObject: service(),
  classNames        : [ 'draggableDropzone' ],
  classNameBindings : [ 'dragClass' ],
  dragClass         : 'zone-deactivated',

  /*dragStart(){
    console.log('dropzone activated');
    this.set('dragClass', 'zone-activated');
  },

  dragStop(){
    console.log('dropzone deactivated');
    this.set('dragClass', 'zone-deactivated');
  },*/

  dragLeave(event) {
    event.preventDefault();
    this.set('dragClass', 'zone-deactivated');
    return false;
  },

  dragOver(event) {
    event.preventDefault();
    this.set('dragClass', 'zone-activated');
    return false;
  },

  drop(e) {
    console.log('drop occured');
    this.set('dragClass', 'zone-deactivated');
    let xy = e.dataTransfer.getData("position").split(',');
    this.draggableObject.moveTo(
      `${e.originalEvent.clientX + parseInt(xy[0])}`,
      `${e.originalEvent.clientY + parseInt(xy[1])}`,
    );
    return false;
  }
});

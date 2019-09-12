import Service from '@ember/service';

export default Service.extend({
  object: null,
  bounds: null,

  drag(object, bounds, grid) {
    this.set('object', object);
    this.set('bounds', bounds);
    this.set('grid', grid);
  },

  moveTo(x, y) {
    let gX = this.get('grid')[0];
    let gY = this.get('grid')[1];
    let hX = gX / 2 - gX % 2;
    let hY = gY / 2 - gY % 2;
    if(this.get('object')) {
      console.log('draggable moved to x y');
      let rX = (x % gX > hX) ? (x - x % gX + gX) : (x - x % gX);
      let rY = (y % gY > hY) ? (y - y % gY + gY) : (y - y % gY);

      this.get('object').set('x', rX);
      this.get('object').set('y', rY);
    }
  }
});

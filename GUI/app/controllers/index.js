import Controller from '@ember/controller';

export default Controller.extend({
  wsMessageHandler(event) {
    let data = JSON.parse(event.data);
    let node = this.store.peekRecord('cnode', data.id);
    if (node){
      node.set('enabled', data.enabled);
      node.set('powerstate', data.powerstate);
    }
    //this.store.push()
  }
});

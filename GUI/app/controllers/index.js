import Controller from '@ember/controller';

export default Controller.extend({
  wsMessageHandler(event) {
    this.get('model').acceptNodeChanges(JSON.parse(event.data));
  }
});

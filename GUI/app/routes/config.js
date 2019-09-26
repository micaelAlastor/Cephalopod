import Route from '@ember/routing/route';
import { A } from '@ember/array';

export default Route.extend({

  setupController(controller, blocks) {
    this._super(controller, blocks);
  },

  model() {
    let self = this;
    return this.store.findAll('cblock', { reload: true }).then(function(blocks) {
      return A(blocks);
    });
  },

  actions: {
    refreshRoute() {
      this.refresh();
      console.log('after refresh');
    }
  }
});

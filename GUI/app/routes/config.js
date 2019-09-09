import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    //, { reload: true }
    return this.store.findAll('cblock');
  },

  actions: {
    refresh() {
      this.refresh();
    }
  }
});

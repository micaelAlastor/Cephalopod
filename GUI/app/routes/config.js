import Route from '@ember/routing/route';
import Scheme from '../models/scheme';

export default Route.extend({
  processModel(json) {
    let scheme = Scheme.create({});
    scheme.acceptJson(json);
    return scheme;
  },

  model() {
    return this.store.findAll('cblock');
  }
});

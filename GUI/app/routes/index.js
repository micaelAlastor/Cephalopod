import Route from '@ember/routing/route';
//import fetch from 'fetch';
import EmberObject from '@ember/object';

export default Route.extend({
	model() {
    return $.getJSON('/api/network').then(function(response) {
      return response;
    });
  }
});

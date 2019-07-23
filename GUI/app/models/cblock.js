import DS from 'ember-data';
const {Model} = DS;
import {computed} from '@ember/object';

export default Model.extend({
  name: DS.attr('string', {defaultValue: 'module'}),
  nodestype: DS.attr('string', {defaultValue: 'pc'}),
  pc: computed('nodestype', function() {
      return this.nodestype === 'pc';
  }),
  pj: computed('nodestype', function() {
    return this.nodestype === 'pj';
  }),
  awps: DS.hasMany('cawp', {async: false})
});

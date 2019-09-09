import DS from 'ember-data';
const { Model } = DS;
import {computed} from '@ember/object';

export default Model.extend({
  block: DS.belongsTo('cblock', {async: false}),
  name: DS.attr('string', {defaultValue: 'awp'}),
  position: DS.attr('number', {defaultValue: '0'}),
  nodestype: DS.attr('string', {defaultValue: 'pc'}),
  pc: computed('nodestype', function() {
    return this.nodestype === 'pc';
  }),
  pj: computed('nodestype', function() {
    return this.nodestype === 'pj';
  }),
  nodes: DS.hasMany('cnode', {async: false})
});

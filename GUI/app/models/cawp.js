import DS from 'ember-data';
const { Model } = DS;
import {computed} from '@ember/object';

export default Model.extend({
  block: DS.belongsTo('cblock', {async: false}),
  name: DS.attr('string', {defaultValue: 'Рабочее место'}),
  position: DS.attr('number', {defaultValue: 0}),
  x: DS.attr('number', {defaultValue: 20}),
  y: DS.attr('number', {defaultValue: 20}),
  width: DS.attr('number', {defaultValue: 350}),
  height: DS.attr('number', {defaultValue: 100}),
  nodestype: DS.attr('string', {defaultValue: 'pc'}),
  pc: computed('nodestype', function() {
    return this.nodestype === 'pc';
  }),
  pj: computed('nodestype', function() {
    return this.nodestype === 'pj';
  }),
  nodes: DS.hasMany('cnode', {async: false})
});

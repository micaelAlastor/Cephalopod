import DS from 'ember-data';
const {Model} = DS;
import {computed} from '@ember/object';

export default Model.extend({
  name: DS.attr('string', {defaultValue: 'Модуль'}),
  position: DS.attr('number', {defaultValue: 0}),
  x: DS.attr('number', {defaultValue: 300}),
  y: DS.attr('number', {defaultValue: 300}),
  width: DS.attr('number', {defaultValue: 420}),
  height: DS.attr('number', {defaultValue: 200}),
  nodestype: DS.attr('string', {defaultValue: 'pc'}),
  pc: computed('nodestype', function() {
      return this.nodestype === 'pc';
  }),
  pj: computed('nodestype', function() {
    return this.nodestype === 'pj';
  }),
  awps: DS.hasMany('cawp', {async: false})
});

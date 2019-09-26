import DS from 'ember-data';
const { Model } = DS;
import {computed} from '@ember/object';

export default Model.extend({
  block: DS.belongsTo('cblock', {async: false}),
  awp: DS.belongsTo('cawp', {async: false}),
  name: DS.attr('string', {defaultValue: ''}),
  position: DS.attr('number', {defaultValue: '0'}),
  ip: DS.attr('string', {defaultValue: '0.0.0.0'}),
  mac: DS.attr('string', {defaultValue: '00:00:00:00:00:00'}),
  powerstate: DS.attr('string', {defaultValue: '0'}),
  pc: computed('awp.nodestype', function() {
    return this.awp.nodestype === 'pc';
  }),
  pj: computed('awp.nodestype', function() {
    return this.awp.nodestype === 'pj';
  }),
});

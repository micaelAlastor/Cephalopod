import DS from 'ember-data';
const { Model } = DS;
import {computed} from '@ember/object';

export default Model.extend({
  block: DS.belongsTo('cblock', {async: false}),
  awp: DS.belongsTo('cawp', {async: false}),
  name: DS.attr('string', {defaultValue: 'Node'}),
  ip: DS.attr('string', {defaultValue: '000.000.000.000'}),
  mac: DS.attr('string', {defaultValue: '-----'}),
  powerstate: DS.attr('string', {defaultValue: '0'}),
  pc: computed('awp.nodestype', function() {
    return this.awp.nodestype === 'pc';
  }),
  pj: computed('awp.nodestype', function() {
    return this.awp.nodestype === 'pj';
  }),
});

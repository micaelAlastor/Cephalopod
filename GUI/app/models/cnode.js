import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  awp: DS.belongsTo('cawp'),
  name: DS.attr('string', {defaultValue: 'module'}),
  ip: DS.attr('string', {defaultValue: 'module'}),
  mac: DS.attr('string', {defaultValue: 'module'}),
  powerstate: DS.attr('string', {defaultValue: 'module'}),
});

import Component from '@ember/component';
import {computed} from '@ember/object';
import contextMenuMixin from 'ember-context-menu';

export default Component.extend(contextMenuMixin, {
  classNames: ['node', 'node-pj'],
  classNameBindings: ['isEnabled:node-enabled:node-disabled', 'powerstate'],
  isEnabled: computed('node.enabled', function () {
    return this.get('node.enabled');
  }),
  powerstate: computed('node.powerstate', function () {
    let powerstate = this.get('node.powerstate');
    if (powerstate === '0') {
      return 'power-off';
    } else if (powerstate === '1') {
      return 'power-on';
    } else if (powerstate === '2') {
      return 'power-cooling-down';
    } else if (powerstate === '3') {
      return 'power-warming-up';
    }
  }),
  node: null,

  contextItems: [
    {
      label: 'power on',
      icon: true,
      itemClassName: 'item_wakeup',
      action(selection, details, event) {
        console.log('pj poweron');
        $.post('/api/pjpoweron', selection[0].toJSON(), function (response) {
          // Do something with the request
        }, 'json');
      }
    },
    {
      label: 'power off',
      icon: true,
      itemClassName: 'item_shutdown',
      action(selection, details, event) {
        console.log('pj poweroff');
        $.post('/api/pjpoweroff', selection[0].toJSON(), function (response) {
          // Do something with the request
        }, 'json');
      }
    }
  ],

  contextSelection: computed('node', function () {
    return this.node;
  })
});

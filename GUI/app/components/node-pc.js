import Component from '@ember/component';
import {computed} from '@ember/object';
import contextMenuMixin from 'ember-context-menu';

export default Component.extend(contextMenuMixin, {
  classNames: ['node', 'node-pc'],
  classNameBindings: ['isEnabled:node-enabled:node-disabled'],
  isEnabled: computed('node.enabled', function () {
    return '$node.enabled'
  }),
  node: null,

  contextItems: [
    {
      label: 'wakeup',
      //icon: 'search',
      action(selection, details, event) {
        console.log('wakeup');
        $.post('/api/wakeup', selection[0], function (response) {
          // Do something with the request
        }, 'json');
      }
    },
    {
      label: 'reboot',
      action(selection, details, event) { /* do something */
      }
    },
    {
      label: 'shutdown',
      action(selection, details, event) { /* do something */
      }
    }
  ],

  contextSelection: computed('node', function () {
    return this.node;
  })
});

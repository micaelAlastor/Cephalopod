import Component from '@ember/component';
import {computed} from '@ember/object';
import contextMenuMixin from 'ember-context-menu';

export default Component.extend(contextMenuMixin, {
  classNames: ['node', 'node-pc'],
  classNameBindings: ['isEnabled:node-enabled:node-disabled'],
  isEnabled: computed('node.enabled', function () {
    return this.get('node.enabled');
  }),
  node: null,

  contextItems: [
    {
      label: 'wakeup',
      icon: true,
      itemClassName: 'item_wakeup',
      action(selection, details, event) {
        console.log('wakeup');
        $.post('/api/wakeup', selection[0], function (response) {
          // Do something with the request
        }, 'json');
      }
    },
    {
      label: 'reboot',
      icon: true,
      itemClassName: 'item_reboot',
      action(selection, details, event) { /* do something */
      }
    },
    {
      label: 'shutdown',
      icon: true,
      itemClassName: 'item_shutdown',
      action(selection, details, event) { /* do something */
      }
    }
  ],

  contextSelection: computed('node', function () {
    return this.node;
  })
});

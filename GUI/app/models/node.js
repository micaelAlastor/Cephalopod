import EmberObject from '@ember/object';

export default EmberObject.extend({

  acceptJson(json) {
    this.set('name', json.name);
    this.set('ip', json.ip);
    if (this.type === 'pc') {
      this.set('mac', json.mac);
      this.set('enabled', json.enabled);
    }
    if (this.type === 'pj') {
      this.set('powerState', json.powerState);
    }
  },
  toJSON(){
    return this.getProperties('name', 'ip', 'mac', 'enabled');
  }

});

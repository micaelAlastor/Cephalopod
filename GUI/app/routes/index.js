import Route from '@ember/routing/route';
//import fetch from 'fetch';
//import EmberObject from '@ember/object';
import {inject as service} from '@ember/service'
import {on} from '@ember/object/evented';
import Scheme from '../models/scheme';
//import Block from '../models/block';

export default Route.extend({
  websockets: service(),
  socketRef: null,

  startWS: on('activate', function () {
    console.log('start web socket');

    const socket = this.websockets.socketFor('ws://localhost:8080');
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  }),

  stopWS: on('deactivate', function () {
    console.log('start web socket');

    const socket = this.socketRef;
    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);

    this.set('socketRef', socket);
  }),

  myOpenHandler(event) {
    console.log(`On open event has been called: ${event}`);
  },

  myMessageHandler(event) {
    console.log(`Message: ${event.data}`);
    // sending a send event to websocket server
    this.socketRef.send('connected');
  },

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  },

  actions: {
    didTransition() {
    }
  },

  processModel(json) {
    let scheme = Scheme.create({});
    scheme.acceptJson(json);
    return scheme;
  },

  model() {
    let self = this;
    return $.getJSON('/api/network').then(function (response) {
      return self.processModel(response);
    });
  }
});

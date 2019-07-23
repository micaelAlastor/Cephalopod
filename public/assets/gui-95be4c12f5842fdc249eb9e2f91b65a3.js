"use strict"
define("gui/app",["exports","gui/resolver","ember-load-initializers","gui/config/environment"],function(e,t,n,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=Ember.Application.extend({modulePrefix:o.default.modulePrefix,podModulePrefix:o.default.podModulePrefix,Resolver:t.default});(0,n.default)(i,o.default.modulePrefix)
var a=i
e.default=a}),define("gui/components/context-menu-item",["exports","ember-context-menu/components/context-menu-item"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("gui/components/context-menu",["exports","ember-context-menu/components/context-menu"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("gui/components/ember-wormhole",["exports","ember-wormhole/components/ember-wormhole"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("gui/components/node-pc",["exports","ember-context-menu"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Component.extend(t.default,{classNames:["node","node-pc"],classNameBindings:["isEnabled:node-enabled:node-disabled"],isEnabled:Ember.computed("node.enabled",function(){return this.get("node.enabled")}),node:null,contextItems:[{label:"wakeup",icon:!0,itemClassName:"item_wakeup",action:function(e,t,n){console.log("wakeup"),$.post("/api/wakeup",e[0].toJSON(),function(e){},"json")}},{label:"reboot",icon:!0,itemClassName:"item_reboot",action:function(e,t,n){console.log("reboot"),$.post("/api/reboot",e[0].toJSON(),function(e){},"json")}},{label:"shutdown",icon:!0,itemClassName:"item_shutdown",action:function(e,t,n){console.log("shutdown"),$.post("/api/shutdown",e[0].toJSON(),function(e){},"json")}}],contextSelection:Ember.computed("node",function(){return this.node})})
e.default=n}),define("gui/components/nodes-block",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({classNames:["nodes-block"]})
e.default=t}),define("gui/helpers/app-version",["exports","gui/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){function o(e){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.default.APP.version,a=o.versionOnly||o.hideSha,l=o.shaOnly||o.hideVersion,s=null
return a&&(o.showExtended&&(s=i.match(n.versionExtendedRegExp)),s||(s=i.match(n.versionRegExp))),l&&(s=i.match(n.shaRegExp)),s?s[0]:i}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=o,e.default=void 0
var i=Ember.Helper.helper(o)
e.default=i}),define("gui/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("gui/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("gui/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","gui/config/environment"],function(e,t,n){var o,i
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n.default.APP&&(o=n.default.APP.name,i=n.default.APP.version)
var a={name:"App Version",initialize:(0,t.default)(o,i)}
e.default=a}),define("gui/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}
e.default=n}),define("gui/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o={name:"ember-data",initialize:t.default}
e.default=o}),define("gui/initializers/export-application-global",["exports","gui/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var o,i=t.default.exportApplicationGlobal
o="string"==typeof i?i:Ember.String.classify(t.default.modulePrefix),n[o]||(n[o]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[o]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default=void 0
var o={name:"export-application-global",initialize:n}
e.default=o}),define("gui/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"ember-data",initialize:t.default}
e.default=n}),define("gui/models/block",["exports","gui/models/node"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Object.extend({name:"",type:"",nodes:null,acceptJson:function(e){this.set("name",e.name),this.set("type",e.type),this.set("nodes",Ember.A())
var n=this
e.nodes.forEach(function(e){var o=t.default.create({type:n.type})
o.acceptJson(e),n.addNode(o)})},addNode:function(e){this.nodes.pushObject(e)}})
e.default=n}),define("gui/models/node",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Object.extend({acceptJson:function(e){this.set("name",e.name),this.set("ip",e.ip),"pc"===this.type&&(this.set("mac",e.mac),this.set("enabled",e.enabled))},toJSON:function(){return this.getProperties("name","ip","mac","enabled")}})
e.default=t}),define("gui/models/scheme",["exports","gui/models/block"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Object.extend({blocks:Ember.A([]),acceptJson:function(e){var n=this
e.blocks.forEach(function(e){var o=t.default.create({})
o.acceptJson(e),n.addBlock(o)})},addBlock:function(e){this.blocks.pushObject(e)}})
e.default=n}),define("gui/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("gui/router",["exports","gui/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){})
var o=n
e.default=o}),define("gui/routes/index",["exports","gui/models/scheme"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Route.extend({websockets:Ember.inject.service(),socketRef:null,startWS:Ember.on("activate",function(){console.log("start web socket")
var e=this.websockets.socketFor("ws://localhost:8080")
e.on("open",this.myOpenHandler,this),e.on("message",this.myMessageHandler,this),e.on("close",this.myCloseHandler,this),this.set("socketRef",e)}),stopWS:Ember.on("deactivate",function(){console.log("start web socket")
var e=this.socketRef
e.off("open",this.myOpenHandler),e.off("message",this.myMessageHandler),e.off("close",this.myCloseHandler),this.set("socketRef",e)}),myOpenHandler:function(e){console.log("On open event has been called: ".concat(e))},myMessageHandler:function(e){console.log("Message: ".concat(e.data)),this.socketRef.send("connected")},myCloseHandler:function(e){console.log("On close event has been called: ".concat(e))},actions:{didTransition:function(){}},processModel:function(e){var n=t.default.create({})
return n.acceptJson(e),n},model:function(){var e=this
return $.getJSON("/api/network").then(function(t){return e.processModel(t)})}})
e.default=n}),define("gui/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("gui/services/context-menu",["exports","ember-context-menu/services/context-menu"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("gui/services/socket-io",["exports","ember-websockets/services/socket-io"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("gui/services/websockets",["exports","ember-websockets/services/websockets"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("gui/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"OmnElqE7",block:'{"symbols":[],"statements":[[1,[23,"context-menu"],false],[0,"\\n"],[1,[23,"outlet"],false]],"hasEval":false}',meta:{moduleName:"gui/templates/application.hbs"}})
e.default=t}),define("gui/templates/components/node-pc",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"GF4VbDAU",block:'{"symbols":[],"statements":[[7,"div"],[11,"class","node-pane"],[9],[0,"\\n  "],[7,"span"],[11,"class","node-name"],[9],[1,[25,["node","name"]],false],[10],[0,"\\n  "],[7,"div"],[11,"class","tooltip"],[9],[0,"\\n    "],[7,"div"],[9],[0,"IP: "],[1,[25,["node","ip"]],false],[10],[0,"\\n    "],[7,"div"],[9],[0,"MAC: "],[1,[25,["node","mac"]],false],[10],[0,"\\n  "],[10],[0,"\\n"],[10]],"hasEval":false}',meta:{moduleName:"gui/templates/components/node-pc.hbs"}})
e.default=t}),define("gui/templates/components/nodes-block",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"Nk9aeFa/",block:'{"symbols":["node"],"statements":[[7,"div"],[11,"class","block-name"],[9],[1,[25,["block","name"]],false],[10],[0,"\\n"],[7,"div"],[11,"class","block-pane"],[9],[0,"\\n"],[4,"each",[[25,["block","nodes"]]],null,{"statements":[[0,"    "],[5,"node-pc",[],[["@node"],[[24,1,[]]]]],[0,"\\n"]],"parameters":[1]},null],[0,"  "],[7,"div"],[11,"class","block-control"],[9],[0,"\\n    "],[7,"span"],[11,"class","block-wakeup"],[9],[10],[0,"\\n    "],[7,"span"],[11,"class","block-reboot"],[9],[10],[0,"\\n    "],[7,"span"],[11,"class","block-shutdown"],[9],[10],[0,"\\n  "],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"gui/templates/components/nodes-block.hbs"}})
e.default=t}),define("gui/templates/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"bun0m9EJ",block:'{"symbols":["block"],"statements":[[4,"each",[[24,0,["model","blocks"]]],null,{"statements":[[0,"  "],[5,"nodes-block",[],[["@block"],[[24,1,[]]]]],[0,"\\n"]],"parameters":[1]},null],[1,[23,"outlet"],false]],"hasEval":false}',meta:{moduleName:"gui/templates/index.hbs"}})
e.default=t}),define("gui/config/environment",[],function(){try{var e="gui/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(decodeURIComponent(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(o){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("gui/app").default.create({name:"gui",version:"0.0.0+420536dd"})

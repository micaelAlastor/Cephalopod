"use strict"
define("gui/app",["exports","gui/resolver","ember-load-initializers","gui/config/environment"],function(e,i,t,a){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Application.extend({modulePrefix:a.default.modulePrefix,podModulePrefix:a.default.podModulePrefix,Resolver:i.default});(0,t.default)(n,a.default.modulePrefix)
var r=n
e.default=r}),define("gui/helpers/app-version",["exports","gui/config/environment","ember-cli-app-version/utils/regexp"],function(e,i,t){function a(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=i.default.APP.version,r=a.versionOnly||a.hideSha,o=a.shaOnly||a.hideVersion,l=null
return r&&(a.showExtended&&(l=n.match(t.versionExtendedRegExp)),l||(l=n.match(t.versionRegExp))),o&&(l=n.match(t.shaRegExp)),l?l[0]:n}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=a,e.default=void 0
var n=Ember.Helper.helper(a)
e.default=n}),define("gui/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=i.default
e.default=t}),define("gui/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=i.default
e.default=t}),define("gui/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","gui/config/environment"],function(e,i,t){var a,n
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,t.default.APP&&(a=t.default.APP.name,n=t.default.APP.version)
var r={name:"App Version",initialize:(0,i.default)(a,n)}
e.default=r}),define("gui/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",i.default),e.inject("container-debug-adapter:main","namespace","application:main")}}
e.default=t}),define("gui/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,i,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a={name:"ember-data",initialize:i.default}
e.default=a}),define("gui/initializers/export-application-global",["exports","gui/config/environment"],function(e,i){function t(){var e=arguments[1]||arguments[0]
if(!1!==i.default.exportApplicationGlobal){var t
if("undefined"!=typeof window)t=window
else if("undefined"!=typeof global)t=global
else{if("undefined"==typeof self)return
t=self}var a,n=i.default.exportApplicationGlobal
a="string"==typeof n?n:Ember.String.classify(i.default.modulePrefix),t[a]||(t[a]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete t[a]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=t,e.default=void 0
var a={name:"export-application-global",initialize:t}
e.default=a}),define("gui/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t={name:"ember-data",initialize:i.default}
e.default=t}),define("gui/resolver",["exports","ember-resolver"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=i.default
e.default=t}),define("gui/router",["exports","gui/config/environment"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Router.extend({location:i.default.locationType,rootURL:i.default.rootURL})
t.map(function(){})
var a=t
e.default=a}),define("gui/services/ajax",["exports","ember-ajax/services/ajax"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})}),define("gui/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=Ember.HTMLBars.template({id:"PkdWOMmL",block:'{"symbols":[],"statements":[[7,"span"],[9],[0,"Hi there"],[10],[0,"\\n\\n"],[1,[23,"outlet"],false]],"hasEval":false}',meta:{moduleName:"gui/templates/application.hbs"}})
e.default=i}),define("gui/config/environment",[],function(){try{var e="gui/config/environment",i=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),t={default:JSON.parse(decodeURIComponent(i))}
return Object.defineProperty(t,"__esModule",{value:!0}),t}catch(a){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("gui/app").default.create({name:"gui",version:"0.0.0+a0a198b0"})

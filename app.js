var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var networkRouter = require('./routes/network.js');

//icmp ping
const netPing = require("net-ping");
var netPingSession = netPing.createSession();

//ip to mac
const find = require('local-devices');

//web sockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

//ssh
var sequest = require('sequest');

//wake on lan
var wol = require('wake_on_lan');

//pjlink
var pjlink = require('pjlink');

//
var app = express();

ssh = {};
blocks = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//api routes
app.use('/api/network', networkRouter);


//pc api calls

app.post('/api/wakeup', function(req, res) {
  console.log('wake on lan: ');
  let node = req.body;
  console.log(node);      // your JSON
  //console.log('ssh is ', ssh);      // your JSON
  // {address: node.ip}
  wol.wake(node.mac);
  //
  res.json(node);
});

app.post('/api/reboot', function(req, res) {
  console.log('reboot: ');
  let node = req.body;
  console.log(node);      // your JSON
  //
  sequest('fma@' + node.ip,
      {
        command: 'sudo shutdown --reboot now "System goes on reboot now"',
        username: 'fma',
        password: 'lordofether'
  },
      function (e, stdout) {
        if (e) {
          console.log(e);
          //throw e;
        }
    console.log(stdout.split('\n'))
  });
  //
  res.json(node);
});

app.post('/api/shutdown', function(req, res) {
  console.log('shutdown: ');
  let node = req.body;
  console.log(node);      // your JSON
  //
  sequest('fma@' + node.ip,
      {
        command: 'sudo shutdown -P now "System goes down now"',
        username: 'fma',
        password: 'lordofether'
      },
      function (e, stdout) {
        if (e) {
          console.log(e);
          //throw e;
        }
        console.log(stdout.split('\n'))
      });
  //
  res.json(node);
});

//pjlink api calls

app.post('/api/pjpoweron', function(req, res) {
  console.log('pjlink poweron: ');
  let node = req.body;
  console.log(node);      // your JSON
  //
  if(!node.beamer){
    node.beamer = new pjlink(node.ip, 10000, "JBMIAProjectorLink");
  }
  node.beamer.powerOn(function(err){
    if(err){
      console.log('error turning on', err);
      return;
    }
  });
  //
  res.json(node);
});

/*app.post('/api/reboot', function(req, res) {
  console.log('reboot: ');
  let node = req.body;
  console.log(node);      // your JSON
  //
  sequest('fma@' + node.ip,
      {
        command: 'sudo shutdown --reboot now "System goes on reboot now"',
        username: 'fma',
        password: 'lordofether'
      },
      function (e, stdout) {
        if (e) {
          console.log(e);
          //throw e;
        }
        console.log(stdout.split('\n'))
      });
  //
  res.json(node);
});*/

app.post('/api/pjpoweroff', function(req, res) {
  console.log('shutdown: ');
  let node = req.body;
  console.log(node);      // your JSON
  //

  //
  res.json(node);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//ws stuff here
function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  //
  ws.on('message', function (message) {
    console.log('received: %s', message)
  });
});

const interval = setInterval(function wsPing() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

const netPingInterval = setInterval(function netPingFunc() {
  blocks.forEach(function eachBlock(block){
    if(block.type === "pc"){
      block.nodes.forEach(function eachPC(pcNode){
        netPingSession.pingHost (pcNode.ip, function (error, target) {
          if (error)
            if (error instanceof netPing.RequestTimedOutError){
              console.log (target + ": Not alive");
              pcNode.enabled = false;
              wss.clients.forEach(function each(ws) {
                ws.send(target + " is a dead host");
              });
            }
            else
              console.log (target + ": " + error.toString ());
          else {
            pcNode.enabled = true;
            console.log (target + ": Alive");
          }
        });
      })
    }
    else {
      block.nodes.forEach(function eachPJ(pjNode){
        /**
         Four possible power states:
         * 0 /	pjlink.POWER.OFF
         * 1 /	pjlink.POWER.ON
         * 2 /	pjlink.POWER.COOLING_DOWN
         * 3 /	pjlink.POWER.WARMING_UP
         **/
        pjNode.beamer.getPowerState(function(err, state){
          if(err){
            console.log(err);
            return;
          }
          pjNode.powerState = state;
          wss.clients.forEach(function each(ws) {
            ws.send(pjNode + " state is " + state);
          });
          console.log('power', err, state);
        });
      })
    }
  })
}, 10000);



module.exports = app;

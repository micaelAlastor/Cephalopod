var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var networkRouter = require('./routes/network.js');

//icmp ping
var netPing = require("net-ping");
var netPingSession = netPing.createSession();

//web sockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

//ssh


var app = express();

ssh = {};
blocks = [];

//wake on lan
var wol = require('wake_on_lan');

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
  res.json(node);
});

app.post('/api/shutdown', function(req, res) {
  console.log('shutdown: ');
  let node = req.body;
  console.log(node);      // your JSON
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
      block.nodes.forEach(function eachNode(node){
        netPingSession.pingHost (node.ip, function (error, target) {
          if (error)
            if (error instanceof netPing.RequestTimedOutError){
              console.log (target + ": Not alive");
              wss.clients.forEach(function each(ws) {
                ws.send(target + " is a dead host");
              });
            }
            else
              console.log (target + ": " + error.toString ());
          else {
            console.log (target + ": Alive");
          }
        });
      })
    }
  })
}, 10000);



module.exports = app;

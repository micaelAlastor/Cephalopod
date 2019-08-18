var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

//icmp ping
const netPing = require("net-ping");
var netPingSession = netPing.createSession();

//ip to mac
//const find = require('local-devices');

//web sockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

//ssh
var sequest = require('sequest');

//wake on lan
var wol = require('wake_on_lan');

//pjlink
var pjlink = require('pjlink');

//
var app = express();

//ember data related settings
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
//end of ember..

ssh = {};
localNetwork = {blocks: []};
pjBeamers = {};
localNetwork.findNodeById = function (id) {
    let node = null;
    localNetwork.blocks.forEach(function (eachBlock) {
        eachBlock.nodes.forEach(function (eachNode) {
            if (eachNode.id === id) {
                node = eachNode;
            }
        })
    });
    return node;
};
localNetwork.findNodeByIp = function (ip) {
    let node = null;
    localNetwork.blocks.forEach(function (eachBlock) {
        eachBlock.nodes.forEach(function (eachNode) {
            if (eachNode.ip === ip) {
                node = eachNode;
            }
        })
    });
    return node;
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//MAIN ROUTER. All API requests are processed here
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


//ws stuff here
function noop() {
}

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
    localNetwork.blocks.forEach(function eachBlock(block) {
        block.awps.forEach(function eachAWP(awp) {
            awp.nodes.forEach(function eachNode(nodeData) {
                //for each and every node

                //net-ping
                netPingSession.pingHost(nodeData.ip, function (error, target) {
                    if (error)
                        if (error instanceof netPing.RequestTimedOutError) {
                            console.log(target);
                            nodeData.enabled = false;
                        } else
                            console.log(target + ": " + error.toString());
                    else {
                        nodeData.enabled = true;
                        console.log(target + ": Alive");
                    }
                    wss.clients.forEach(function each(ws) {
                        ws.send(JSON.stringify(nodeData));
                    });
                });

                //pjlink requests for enabled projectors
                if (awp.nodestype === 'pj' && nodeData.enabled) {
                    /*Four possible power states:
                    * 0 /    pjlink.POWER.OFF
                    * 1 /    pjlink.POWER.ON
                    * 2 /    pjlink.POWER.COOLING_DOWN
                    * 3 /    pjlink.POWER.WARMING_UP*/
                    let nodeBeamer = pjBeamers[nodeData.id];
                    if(nodeBeamer) {
                        pjBeamers[nodeData.id].getPowerState(function (err, state) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            nodeData.powerState = state;
                            wss.clients.forEach(function each(ws) {
                                ws.send(JSON.stringify(nodeData));
                            });
                            console.log('power', err, state);
                        })
                    } else {
                        console.log('there is no beamer for:' + nodeData);
                    }
                }
            });
        });
    })
}, 3000);


module.exports = app;

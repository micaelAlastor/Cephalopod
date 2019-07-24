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


app.use('/', indexRouter);


//pc api calls
app.post('/api/wakeup', function (req, res) {
    console.log('wake on lan: ');
    let node = req.body;
    console.log(node);      // your JSON
    //console.log('ssh is ', ssh);      // your JSON
    // {address: node.ip}
    wol.wake(node.mac);
    //
    res.json(node);
});

app.post('/api/block/wakeup', function (req, res) {
    console.log('wake block on lan: ');

    let foundBlock = localNetwork.blocks.find(function (aBlock) {
        return aBlock.id === req.body.id;
    });

    foundBlock.nodes.forEach(function (sleepyNode) {
        wol.wake(sleepyNode.mac);
    });
    //
    res.json(foundBlock);
});

app.post('/api/reboot', function (req, res) {
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

app.post('/api/shutdown', function (req, res) {
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

app.post('/api/pjpoweron', function (req, res) {
    console.log('pjlink poweron: ');
    let id = req.body.id;
    let node = localNetwork.findNodeById(id);
    //console.log(node);      // your JSON
    //

    pjBeamers[node.id].powerOn(function (err) {
        if (err) {
            console.log('error turning on', err);
            return;
        }
    });
    //
    res.json(node);
});

app.post('/api/pjpoweroff', function (req, res) {
    console.log('shutdown: ');
    let id = req.body.id;
    let node = localNetwork.findNodeById(id);
    //console.log(node);      // your JSON
    //
    pjBeamers[node.id].powerOff(function (err) {
        if (err) {
            console.log('error turning off', err);
            return;
        }
    });
    //
    res.json(node);
});

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
            awp.nodes.forEach(function eachPC(nodeData) {
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
            });
        });


        block.awps.forEach(function eachAWP(awp) {
            if (awp.nodestype === 'pj') {
                awp.nodes.forEach(function eachPJ(pjNode) {

                    /*Four possible power states:
                    * 0 /    pjlink.POWER.OFF
                    * 1 /    pjlink.POWER.ON
                    * 2 /    pjlink.POWER.COOLING_DOWN
                    * 3 /    pjlink.POWER.WARMING_UP*/

                    pjBeamers[pjNode.id].getPowerState(function (err, state) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        pjNode.powerState = state;
                        wss.clients.forEach(function each(ws) {
                            ws.send(JSON.stringify(pjNode));
                        });
                        console.log('power', err, state);
                    })
                })
            }
        })

    })
}, 3000);


module.exports = app;

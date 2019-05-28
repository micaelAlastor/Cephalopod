var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var networkRouter = require('./routes/network');

var app = express();

//read network scheme
const fs = require('fs');
let rawdata = fs.readFileSync('network.json');
let networkScheme = JSON.parse(rawdata);
console.log(networkScheme);
app.set('networkScheme', networkScheme);
//end of read network scheme

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
app.use('/users', usersRouter);
//api routes
//app.use('/api/network', networkRouter);
app.get('/api/network', function(req, res) {
  res.json(networkScheme);
});
app.post('/api/wakeup', function(req, res) {
  console.log('wake on lan: ');
  let node = req.body;
  console.log(node);      // your JSON
  wol.wake(node.mac, {address: node.ip});
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

module.exports = app;

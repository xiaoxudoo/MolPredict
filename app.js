var express = require('express');
var expressValidator = require('express-validator');
var moment = require("moment");
var request = require('request');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');

var utilsHelper = require('./utils/utils_helper');

var routes = require('./routes/index');

//var threadCount = 0;

console.logCopy = console.log.bind(console);
console.log = function () {
    if (arguments.length) {
        var timestamp = '[' + moment().format('YYYY/MM/DD, HH:mm:ss') + '] ';
        this.logCopy(timestamp);
        for (var i in arguments) {
            this.logCopy(arguments[i]);
        }
    }
};

var app = express();
app.enable("trust proxy");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(require('express-status-monitor')());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("c6ce52eefa874bf2969d257f4053df1e"));
app.use(express.static(path.join(__dirname, 'public'),{maxAge: 0}));
app.use(expressValidator({
  customValidators: {
    isUsername: function(value) {
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/.test(value);
    },
    isPhone: function(value) {
        return /^\d{11}$/.test(value);
    },
    isEmail: function(value) {
        return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(value);
    },
    isAddress: function(value) {
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,100}$/.test(value);
    },
    isString: function(value) {
        return /\S/.test(value);
    },
    isCard: function(value) {
        return /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value);
    }
  }
}));  // validator for express

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
  });
});

console.log("drug server start, " + utilsHelper.dateTimestamp());

module.exports = app;

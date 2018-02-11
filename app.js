const express = require('express');
const expressValidator = require('express-validator');
const session = require('express-session')
const flash = require('connect-flash')
const moment = require("moment");
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config');
const utilsHelper = require('./utils/utils_helper');
const routes = require('./routes/index');
global.DB = require("./utils/dbutil.js").Instance();
///定义实体
DB.define({ key: 'User', name: 'xundrug_user', fields: ['id_', 'username', 'password', 'sex', 'updated', 'status', 'role', 'email', 'lastlogintime', 'registertime', 'lastloginip'] });
DB.define({ key: 'Order', name: 'xundrug_order', fields: ['id_', 'userid', 'parameters', 'status', 'startTime', 'endTime', 'results', 'createTime', 'updateTime'] });

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

const app = express();
app.enable("trust proxy");

// session 中间件
app.use(session({
	name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	resave: true, // 强制更新 session
	saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
	cookie: {
		maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
	}
}))
// flash 中间件，用来显示通知
app.use(flash())

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
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));
app.use(expressValidator({
	customValidators: {
		isUsername: function (value) {
			return /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/.test(value);
		},
		isPhone: function (value) {
			return /^\d{11}$/.test(value);
		},
		isEmail: function (value) {
			return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(value);
		},
		isAddress: function (value) {
			return /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,100}$/.test(value);
		},
		isString: function (value) {
			return /\S/.test(value);
		},
		isCard: function (value) {
			return /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value);
		},
		isNumber: function (value) {
			return /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/.test(value);
		}
	}
}));  // validator for express


// 添加模板必需的三个变量
app.use(function (req, res, next) {
	res.locals.user = req.session.user || null
	res.locals.success = req.flash('success').toString()
	res.locals.error = req.flash('error').toString()
	next()
})

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', { error: err });
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {});
});

console.log("drug server start, " + utilsHelper.dateTimestamp());

if (module.parent) {
	// 被 require，则导出 app
	module.exports = app
} else {
	// 监听端口，启动程序
	app.listen(config.port, function () {
		console.log(`xundrug listening on port ${config.port}`)
	})
}
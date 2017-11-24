import { drugserver } from '../config'

var fs = require('fs');
var common = require('../utils/common');
var amqp = require('amqplib/callback_api');
var uuid = require('node-uuid');  // 随机序号，用于定位返回队列
var correlationId = uuid();
var q = 'python'; // 通知计算队列
var q2 = 'ackq';  // 结果返回队列
var conn;  //  rabbitmq 连接
function bail(err, conn) {
  console.error(err);
  if (conn) conn.close(function () { process.exit(1); });
}

var on_connect = function (err, rabbit_conn) {
  if (err !== null) return bail(err);
  conn = rabbit_conn;
}

//建立连接
amqp.connect(`amqp://${drugserver.rabbitHost}`, { 'noDelay': true }, on_connect);

// render prediction page
exports.prediction = function (req, res, next) {
  var file = "pv.data"
  var pv = 0;
  pv = fs.readFileSync(file);
  pv = parseInt(pv) + 1;
  //写入文件
  fs.writeFileSync(file, pv);
  res.render(`drug/pc${req.url}/prediction`, { 'accesscount': pv });
}

exports.theory = function (req, res, next) {
  var name = req.url.slice(1)
  res.render(`drug/pc${req.url}`);
}

exports.run_example = function (req, res, next) {
  var routeName = req.url.split('/')[1]
  var rst = { "flag": 0, "msg": '', 'data': {} };
  // 线程数目
  console.log(global.threadCount++);
  if (global.threadCount > 2) {
    rst.msg = 'The server is busy at the moment. Please try again two minitues later...'
    res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
    return false;
  }

  //创建channel
  conn.createChannel(function (err, ch) {
    if (err !== null) return bail(err, conn);
    ch.assertQueue(q2, { durable: false }, function (err, ok) {
      if (err !== null) return bail(err, conn);
      //定义消费函数
      ch.consume(q2, function (msg) {
        global.threadCount--;
        var json = JSON.parse(msg.content.replace(/\\/g,'').replace(/\"\[/g,'[').replace(/\]\"/g,']'));
        res.render(`drug/pc/${routeName}/absorption.jade`, {'items': json})
        //这里为了提升性能，我们不关闭链接，而是关闭channel，链接可以重用
        ch.close();
      }, { noAck: true });
      //发送数据到消费者
      var data = ["CN(C)CCCN1C2=CC=CC=C2SC2=C1C=C(C=C2)C(C)=O", "0.1"];
      ch.sendToQueue(
        q,
        new Buffer(JSON.stringify(data)),
        {
          replyTo: q2,
          correlationId: correlationId
        }
      );
    });
  });
  
}

exports.formSubmit_absorption = function (req, res, next) {
  var routeName = req.url.split('/')[1]
  req.checkBody('molecular', 'Empty molecular').notEmpty().isString();
  req.checkBody('significant', 'invalid significant').notEmpty().isNumber();
  req.checkBody('runType', 'invalid type').isString();
  var valiErrors = common.uniqObjArray(req.validationErrors());
  var rst = { "flag": 0, "msg": '', 'data': {} };
  if (valiErrors) {
    //表单验证错误
    rst.flag = 1
    rst.msg = valiErrors[0].msg
    res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
  }
  // 线程数目
  console.log(global.threadCount++);
  if (global.threadCount > 2) {
    rst.msg = 'no more than 2 calculations at once, please try again later...'
    res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
    return false;
  }
  var calTypePy = req.body.runType ? `ca_${req.body.runType}_${routeName}.py` : `ca_${routeName}.py`
  var cp = require('child_process'),

    py = cp.spawn('python', [calTypePy]),

    data = [],
    dataString = '';
  rst.data.input = req.body.molecular
  data.push(req.body.molecular, req.body.significant)
  py.stdout.on('data', function (data) {
    dataString += data.toString();
  });

  py.stdout.on('end', function () {
    global.threadCount--;
    // when dataString is not avaliable
    if (dataString == '' || dataString == null) {
      res.render(`drug/pc/${routeName}/error.jade`, { 'error': 'unvalidate molecular, please validate your input smiles.' })
    }
    //  deal json string
    var json = JSON.parse(dataString.replace(/\\/g, '').replace(/\"\[/g, '[').replace(/\]\"/g, ']'));
    res.render(`drug/pc/${routeName}/absorption.jade`, { 'items': json })
  });

  py.on('error', function (err) {
    console.log(new Date());
    console.log('开启失败', err);
    process.exit();
  });

  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
}



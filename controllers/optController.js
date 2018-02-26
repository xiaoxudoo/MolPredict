const fs = require('fs');
const common = require('../utils/common');
const uuid = require("node-uuid");
const logger = require('../utils/logger');
const { python_path } = require('../config');

// render index page
exports.index = function (req, res, next) {
  var file = "pv.data"
  var pv = 0;
  pv = fs.readFileSync(file);
  pv = parseInt(pv) + 1;
  //写入文件
  fs.writeFileSync(file, pv);
  res.render(`drug/pc${req.url}/prediction`, { 'accesscount': pv });
}

exports.about = function (req, res, next) {
  const routeName = 'molopt';
  res.render(`drug/pc${req.url}`);
}

exports.run_example = function (req, res, next) {
  const routeName = 'molopt';
  const rst = { "flag": 0, "msg": '', 'data': {} };
  // 线程数目
  const { exec } = require('child_process');
  const cmdStr = 'ps -aux | grep python | grep ca_ |wc -l';
  exec(cmdStr, function (err, stdout, stderr) {
    if (stdout && stdout > 2) {
      rst.msg = 'The server is busy at the moment. Please try again two minitues later...'
      res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
      return false;
    } else {
      const { spawn } = require('child_process');
      py = spawn('python', [`${python_path}/ca_all_${routeName}.py`]);
      const data = [];
      let dataString = '';
      data.push("CN(C)CCCN1C2=CC=CC=C2SC2=C1C=C(C=C2)C(C)=O", "0.1");
      py.stdout.on('data', function (data) {
        dataString += data.toString();
      });

      py.stdout.on('end', function () {
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
  });
}

exports.cal_opt_step_one = function (req, res, next) {
  const routeName = 'molopt';
  req.checkBody('molecular', 'Empty molecular').notEmpty().isString();
  req.checkBody('runType', 'invalid type').isString();
  let valiErrors = common.uniqObjArray(req.validationErrors());
  const rst = { "flag": 0, "msg": '', 'data': {} };
  if (valiErrors) {
    //表单验证错误
    rst.flag = 1
    rst.msg = valiErrors[0].msg
    res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
  }
  const { exec } = require('child_process');
  const cmdStr = 'ps -aux | grep python | grep ca_ |wc -l';
  exec(cmdStr, function (err, stdout, stderr) {
    if (stdout && stdout > 2) {
      rst.msg = 'The server is busy at the moment. Please try again two minitues later Or LOGIN to queue up a job!'
      res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
      return false;
    } else {
      const calTypePy = req.body.runType ? `${python_path}/ca_${req.body.runType}_${routeName}.py` : `${python_path}/ca_${routeName}.py`
      const { spawn } = require('child_process');
      py = spawn('python', [calTypePy]);
      const data = [];
      let dataString = '';
      rst.data.input = req.body.molecular
      data.push(req.body.molecular)
      py.stdout.on('data', function (data) {
        dataString += data.toString();
      });

      py.stdout.on('end', function () {
        // when dataString is not avaliable
        if (dataString == '' || dataString == null) {
          res.render(`drug/pc/${routeName}/error.jade`, { 'error': 'The input is incorrect. Please have a check.' })
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
  });
}

exports.cal_opt_step_two = function (req, res, next) {
  const routeName = 'molopt';
  const Order = DB.get("Order");
  // req.checkBody('molecular', 'molecular').notEmpty().isString();
  req.checkBody('rsmi', 'rsmi').notEmpty().isString();
  req.checkBody('mode', 'mode').notEmpty().isString();
  var valiErrors = common.uniqObjArray(req.validationErrors());
  var rst = { "flag": 0, "msg": '', 'data': {} };
  if (valiErrors) {
    //表单验证错误
    rst.flag = 1
    rst.msg = valiErrors[0].msg
    res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
  }
  // 线程数目
  var exec = require('child_process').exec;
  var cmdStr = 'ps -aux | grep python | grep ca_ |wc -l';
  exec(cmdStr, function (err, stdout, stderr) {
    let isRunning = null;
    if (process.env.NODE_ENV === 'production') {
      isRunning = stdout && stdout > 1;
    } else {
      isRunning = stdout && stdout < 1;
    }
    // 如果未登录
    if (!req.session.user) {
      if (isRunning) { // python计算的加锁条件
        rst.msg = 'The server is busy at the moment. Please try again two minitues later or LOGIN to queue up a job!'
        res.render(`drug/pc/${routeName}/error.jade`, { 'error': rst.msg })
        return false;
      } else {
        const { spawn } = require('child_process');
        py = spawn('python', [`${python_path}/ca_replace_molopt.py`]);
        const data = [];
        let dataString = '';

        // rst.data.input = req.body.molecular
        data.push(req.body.rsmi, req.body.mode)
        py.stdout.on('data', function (data) {
          dataString += data.toString();
        });

        py.stdout.on('end', function () {
          // when dataString is not avaliable
          if (dataString == '' || dataString == null) {
            res.render(`drug/pc/${routeName}/error.jade`, { 'error': 'The input is incorrect. Please have a check.' })
          }
          //  deal json string
          var json = JSON.parse(dataString.replace(/\\/g, '').replace(/\"\[/g, '[').replace(/\]\"/g, ']'));
          console.log(JSON.stringify(json))
          res.render(`drug/pc/${routeName}/optimisation.jade`, { 'items': json })
        });

        py.on('error', function (err) {
          console.log(new Date(), '开启失败', err);
          process.exit();
        });
  
        py.stdin.write(JSON.stringify(data));
        py.stdin.end();
      }
    } else {
      // 生成订单
      const orderId = uuid.v1();
      const userid = req.session.user.id_;
      let parameters = {
        calType: 'molOpt',
        calSort: 'replace',
        params: {
          // molecular: req.body.molecular,
          frag_name: req.body.rsmi,
          desired_property: req.body.mode
        }
      };
      parameters = JSON.stringify(parameters);
      if (isRunning) { // python计算的加锁条件
        // 将订单状态置为'排队中'; 向xundrug_order表中增加一条数据：订单号，订单状态，用户Id等
        Order.insert({ id_: orderId, userid: userid, status: '1', parameters: parameters }, function (err, result) {
          if (err) {
            logger.error(`orderId:${orderId},userid:${userid},status:${status} 订单插入失败 => ${err}`);
            next(err);
          } else {
            res.redirect("/home");
          }
        });
      } else { // 调用python程序直接计算。
        const calTypePy = `${python_path}/ca_manager.py`; // req.body.runType ? `${python_path}/ca_${req.body.runType}_${routeName}_sql.py` : `${python_path}/ca_${routeName}_sql.py`
        const { spawn } = require('child_process');

        Order.insert({ id_: orderId, userid: userid, status: '5', parameters: parameters, startTime: new Date() }, function (err, result) {
          if (err) {
            logger.error(`orderId:${orderId},userid:${userid},status:${status} 订单插入失败 => ${err}`);
            next(err);
          } else {
            const py = spawn('python', [calTypePy, orderId]);
            py.on('error', function (err) {
              logger.error(`orderId:${orderId},userid:${userid},status:${status} 调用python失败 => ${err}`);
              process.exit();
            });
            res.redirect("/home");
          }
        });
      }
    }
  });
}

exports.query_opt_result = function (req, res, next) {
  const orderId = req.params.id;
  const Order = DB.get("Order");

  Order.get(orderId, function (err, ret) {
    const results = ret.results
    console.log(results);
    // when results is not avaliable
    if (results == '' || results == null) {
      res.render(`drug/pc/molopt/error.jade`, { 'error': 'The input is incorrect. Please have a check.' })
    }
    //  deal json string
    var json = JSON.parse(results.replace(/\\/g, '').replace(/\"\[/g, '[').replace(/\]\"/g, ']'));
    res.render(`drug/pc/molopt/optimisation.jade`, { 'items': json });
  })
}


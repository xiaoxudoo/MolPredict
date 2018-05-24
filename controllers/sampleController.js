const { pvcount, uniqObjArray } = require('../utils/common');
const common = require('../utils/common');
const uuid = require("node-uuid");
const logger = require('../utils/logger');
const { python_path } = require('../config');

// 这两个负责渲染相关页面
exports.index = function (req, res, next) {
  res.render(`drug/pc${req.url}/index`, { 'accesscount': pvcount(1) });
}

exports.about = function (req, res, next) {
  res.render(`drug/pc${req.url}`, { 'accesscount': pvcount(1) });
}

// 以下controllers 写业务逻辑处理


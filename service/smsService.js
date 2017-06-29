/**
 * Created by guotu on 2016-03-07.
 */
var config = require('../config');
var iconv = require('iconv-lite');
var request = require('request');
var utils = require('utility');


exports.smsFuncOld = smsFuncOld;
function smsFuncOld(to, content, callback) {
    var smsConfig = config.sms_config;
    var uri = smsConfig.server.replace('{corpID}', smsConfig.corpId).replace('{srcAddr}', smsConfig.srcAddr);
    uri = uri.replace('{to}', to);
    uri = uri.replace('{msg}', iconv.encode(content, 'gbk').toString('binary'));
    request(uri, function (error, response, body) {
        if (error) {
            return callback(error, null);
        } else {
            return callback(null, body);
        }
    });
};

exports.smsFunc = smsFunc;
function smsFunc(to, content, callback) {
    var smsConfig = config.sms_config_new;
    var md5_rst = utils.md5(smsConfig.pwd).substr(8, 16);
    var serial = new Date().getTime();
    var uri = smsConfig.server.replace('{usr}', smsConfig.usr).replace('{pwd}', md5_rst);
    uri = uri.replace('{to}', to);
    uri = uri.replace('{msg}', encodeURIComponent(content));
    uri = uri.replace('{serial}', serial);
    console.log("开始调用新的短信接口，流水号" + serial + "，发送至" + to + "，内容为：" + content);
    console.log(uri);
    request(uri, function (error, response, body) {
        if (error) {
            return callback(error, null);
            console.log(serial + "发送失败，" + error);
        } else {
            //var entt = JSON.parse(body);
            console.log(body);
            var ent = JSON.parse(body);

            console.log(body.statuscode);
            if (ent && ent["statuscode"] == '000000') {
                console.log(serial + "发送成功");
                return callback(null, body);
            } else {
                console.log(serial + "发送失败，" + body);
                return callback(error, null);
            }
        }
    });
};
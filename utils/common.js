/**
 * Created by guotuo on 2016-01-26.
 */

const moment = require('moment');
const fs = require('fs');

// 计算pv
exports.pvcount = function (plus = 0) {
    const file = "pv.data";
    let pv = 0;
    pv = fs.readFileSync(file);
    pv = parseInt(pv) + plus;
    //写入文件
    fs.writeFileSync(file, pv);
    return pv;
}

//去除对象数组的重复数据
exports.uniqObjArray = function (ary) {
    if (ary) {
        var rst = {};
        ary.forEach(function (item) {
            rst[JSON.stringify(item)] = item;
        });
        rst = Object.keys(rst).map(function (item) {
            return JSON.parse(item);
        });
        return rst;
    }
    return undefined;
};

exports.getUnixTimeSpan = function () {
    //getTime拿到的是毫秒，需要除以1000
    return Math.round(new Date().getTime() / 1000);
};

//精确到毫秒
exports.dateTimeNowfff = function () {
    return moment().format('YYYYMMDDHHmmssSSS');
};

//精确到秒
exports.dateTimeNow = function () {
    return moment().format('YYYYMMDDHHmmss');
};

exports.getStartAndEndOfDay = function (date) {
    var rst = {};
    rst.Start = new Date(date.getFullYear(), date.getMonth(), date.getDate());//这是开始时间
    rst.End = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);//这是一天的结束时间
    return rst;
};

//生成执行事务需要的单个实体
exports.getSqlParamEntity = function (sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
};

//获取数据表id，精确到毫秒
exports.getId = function (cb) {
    var id = moment().format('YYMMDDHHmmssSSS');
    if (cb) {
        return cb(null, id);
    } else {
        return id;
    }
};

exports.getHtml = function (uri, obj, cb) {
    var html = "";
    html += "<html><head>";
    html += "<title>正在处理支付信息 - 乐视体育";
    html += "</title><style>";
    html += "div{position:absolute;left:47%;top:47%;}";
    html += "</style></head><body>";
    html += "<div><img src=\"http://i3.letvimg.com/lc07_letvsports/201606/21/15/05/1466492719966.gif\"/></div>";
    html += "<form id='form1' method='post' action='" + uri + "'>";
    for (var i in obj) {
        html += "<input type='hidden' value='" + obj[i] + "' name='" + i + "'>";
    }
    html += "<script>";
    html += "setTimeout('document.getElementById(\"form1\").submit();',1700)";
    html += "</script>";
    html += "</form></body>";
    html += "</html>";
    if (cb) {
        return cb(null, html);
    } else {
        return html;
    }
};

exports.get500 = function (err, cb) {
    var html = "SYSTEM ERROR";
    console.log(JSON.stringify(err));
    if (JSON.stringify(err).indexOf('ER_DUP_ENTRY') > -1) {
        html = "duplicate order"
    }
    html += "<input type='hidden' value='" + err + "'>";
    return html;
};
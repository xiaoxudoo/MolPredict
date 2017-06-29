/**
 * Created by guotu on 2016-03-03.
 */
//utils_helper.js
var utility = require('utility');
var moment = require('moment');

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

exports.dateTimestamp = function(){
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

//精确到秒
exports.dateTimeNow = function () {
    return moment().format('YYYYMMDDHHmmss');
};

exports.getStartAndEndOfDay = function (date) {
    var rst = {};
    rst.Start = new Date(date.getFullYear(), date.getMonth(), date.getDate());//这是开始时间
    rst.End = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);//这是一天的结束时间
    return rst;
}

exports.isNullOrEmpty = function (str) {
    if (str && str != null && str != "")
        return false;
    return true;
}

exports.md5 = function(str){
    return utility.md5(str);
}
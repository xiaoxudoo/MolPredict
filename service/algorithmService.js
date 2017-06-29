/**
 * Created by guotu on 2016-03-08.
 */
var utilsHepler = require('../utils/utils_helper');

exports.getSign = getSign;
function getSign(o, ensKey) {
    if (typeof (o) == "object") {
        var ary = Object.keys(o).sort();
        console.log("-------" + ary);
        var final = "";
        for (var i = 0; i < ary.length; i++) {
            var key = ary[i];
            //过滤掉sign以及value为空的参数
            if (key != "sign" && o[key] != "" && o[key] != null && o[key] != undefined) {
                final += key + "=" + o[key] + "&";
            }
        }
        final += "key=" + ensKey;

        var sign = utilsHepler.md5(final);
        console.log("最终加密字符串为：" + final + "，加密结果为：" + sign);
        return sign;
    }
    throw "sign object error";
};
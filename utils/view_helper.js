var moment = require('moment');

exports.formatDateTime = function (timestamp) {
    if (timestamp && timestamp != null && timestamp != "") {

        if ((timestamp + "").length == 10) {
            timestamp = timestamp * 1000;
        }
        return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    }
    return "";
};

exports.getOrderStatus = function (code) {
    switch (code) {
        case 1:
            return "待支付";
        case 2:
            return "支付完成";
        case 3:
            return "支付成功";
        case 4:
            return "支付失败";
        default:
            return "-"
    }
};
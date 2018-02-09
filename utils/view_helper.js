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

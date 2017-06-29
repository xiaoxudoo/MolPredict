var fs = require('fs')

var request = require("request");

exports.upload = upload = function (imagePath, func) {
    var formData = {
        username: 'letvsports',
        md5str: "6ea78d5e2f0485df6c81e90e4b81497c",
        watermark: "0",
        compress: "85",
        channel: "letvsports",
        single_upload_submit: "ok",
        //single_upload_file: fs.createReadStream(__dirname + '/../public/img/rarrow.png'),
        single_upload_file: fs.createReadStream(imagePath)
    };
    request.post({
        url: 'http://upload.letvcdn.com:8000/single_upload_tool.php',
        //url: 'http://w.upload2.lelecdn.com:8000/single_upload_tool.php',
        formData: formData
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            console.log("error occured while uploading file to CDN", err);
            return func(err, "");
        }
        /*
         \r\n \r\n{"file":"http:\\/\\/i1.letvimg.com\\/lc03_letvsports\\/201512\\/17\\/18\\/41\\/rarrow.png","state":1}
         */
        var data = JSON.parse(body.trim());
        console.log('cdn上传结果');
        console.log(data);
        if (data.state == 1) {
            return func(null, data.file);
        } else {
            return func(data.state, "");
        }
    });
};


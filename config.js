//数据库的配置
exports.dbConfig = {
    host: '10.154.156.99',
    user: 'game',
    password: '123456',
    database: 'enrollment',
    debug: true,
    connectionLimit: 1000
};


//2016年3月16日 14:39:23 新增新短信接口配置 by sirius
exports.sms_config_new = {
    server: "http://ms.go.le.com/service/message?usr={usr}&pwd={pwd}&to={to}&msg={msg}&linkid={serial}&ext=0",
    usr: 'lsty-0102-sc-01',
    pwd: '5ap2ih87'
};

//本项目的本地配置
exports.drugserver = {

};



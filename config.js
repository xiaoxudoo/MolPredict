//数据库的配置
exports.dbConfig = {
	host: '39.108.10.96', // 39.108.10.96
	user: 'xundrug',
	password: 'xundrug123',
	database: 'xundrug_server',
	debug: true,
	connectionLimit: 1000
};


//2016年3月16日 14:39:23 新增新短信接口配置
exports.sms_config_new = {
	server: "http://ms.go.le.com/service/message?usr={usr}&pwd={pwd}&to={to}&msg={msg}&linkid={serial}&ext=0",
	usr: 'lsty-0102-sc-01',
	pwd: '5ap2ih87'
};

//本项目的本地配置
exports.drugserver = {
	rabbitHost: '120.77.251.182'
};

exports.port = '80' // 8080

exports.logger_path = 'logs/'

exports.session = {
	secret: 'xundrug123',
	key: 'xundrug',
	maxAge: 2592000000
}

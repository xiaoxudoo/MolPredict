//数据库的配置
exports.dbConfig = {
	host: '39.108.10.96', // 39.108.10.96
	user: 'xundrug',
	password: 'xundrug123',
	database: 'xundrug_server',
	debug: true,
	connectionLimit: 1000
};

// 发送邮件
exports.email_config = {
	host: 'smtp.126.com',
	port: '465',
	secure: true,  // true for 465, false for other ports
	user: 'xundrug@126.com',
	pwd: 'xundrug12345',
};

exports.port = '8080' // 8080

exports.logger_path = 'logs/'

exports.python_path = './xundrug_python'

exports.session = {
	secret: 'xundrug123',
	key: 'xundrug',
	maxAge: 2592000000
}

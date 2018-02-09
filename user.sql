-- CREATE TABLE `users` (
--   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
--   `first_name` varchar(30) NOT NULL DEFAULT '',
--   `last_name` varchar(30) NOT NULL DEFAULT '',
--   `email` varchar(30) NOT NULL DEFAULT '',
--   `password` varchar(60) NOT NULL DEFAULT '',
--   `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
--   `created` datetime NOT NULL,
--   `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `salt` varchar(50) NOT NULL DEFAULT '',
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `email` (`email`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- mysql -hlocalhost -uroot -p123
-- source ~/user.sql

CREATE DATABASE xundrug_server;

-- ----------------------------
-- Table structure for t_ef_user
-- ----------------------------
DROP TABLE IF EXISTS `xundrug_user`;
CREATE TABLE `xundrug_user` (
  `id_` varchar(50) NOT NULL,
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `password` varchar(50) DEFAULT NULL COMMENT '密码',
  `sex` varchar(2) DEFAULT NULL COMMENT '性别',
  `status` varchar(2) DEFAULT NULL COMMENT '状态',
  `role` varchar(2) DEFAULT NULL COMMENT '用户类型 1管理员 2会员',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱地址',
  `lastlogintime` datetime DEFAULT NULL COMMENT '最后登录时间',
  `registertime` datetime DEFAULT NULL COMMENT '注册时间',
  `lastloginip` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL COMMENT '更新日期',
  PRIMARY KEY (`id_`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';
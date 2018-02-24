### ubuntu16重启mysql
/etc/init.d/mysql restart
### 在Ubuntu服务器下，MySQL默认是只允许本地登录，因此需要修改配置文件将地址绑定给注释掉：
``` sql
bind-address    = 127.0.0.1     #注释掉这一行就可以远程登录了  
```
### 创建新用户，允许外网 IP 访问
``` sql
create user 'test'@'%' identified by '123456';
```

### 当前改造前的版本号
8dc305af55e99996b658762feee9bf6e3eb6b055

### molopt
frag_name: radio
desired_property: checkbox
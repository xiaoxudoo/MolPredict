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

### config.js
config.js 处理一般的配置项，例如端口，数据库连接

### 开发范式
开发的时候 

在controllers目录下新建一个controller

在routes/index.js下新建路由规则对应上一个controller

在views/drug/pc 下新建一个文件夹，将molopt或者moltox拷贝一份进去， 编写相关的jade模板。
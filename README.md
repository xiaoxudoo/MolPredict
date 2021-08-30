### 本地开发
#### 安装nodejs
打开 https://nodejs.org/en/download/ 下载相应环境下的安装包

安装完成后，执行`node -v`查看版本号，检查是否安装成功

执行`npm -v`查看`npm`版本号，检查npm是否也安装成功（`npm`随`node`一起默认安装了）,
`npm`是`nodejs`的包管理工具，`node`的依赖都使用这个命令安装（类似`python` 的 `pip`）
#### 执行命令
``` js
node -v
npm -v
// npm install pm2 -g  // 全局安装pm2，本地开发不需要pm2，pm2是nodejs的进程管理工具
npm install nodemon -g // 全局安装nodemon，开发时监听文件变化，自动重启服务
npm install            // 安装本项目依赖的包，默认从package.json中读取依赖
npm run dev            // 启动服务，package.json 中定义了此命令执行的脚本
```
在浏览器上打开localhost:8080即可 (config.js 中定义了默认打开的端口)

### 开发范式
开发的时候 

在controllers目录下新建一个controller

在routes/index.js下新建路由规则对应上一个controller

在views/drug/pc 下新建一个文件夹，将molopt或者moltox拷贝一份进去， 编写相关的jade模板。

### config.js
config.js 处理一般的配置项，例如端口，数据库连接

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
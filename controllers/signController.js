var crypto=require("crypto");

exports.getSignin = function (req, res, next) {
  res.render('drug/pc/signin');
}

// 验证是否存在用户名，密码是否正确。
exports.validateSignin = function (req, res, next) {
  //获取form表单数据
  console.log(req.body.loginObj);
  const loginJson = req.body.loginObj;
  //JSON字符串序列化成JSON对象
  const loginObj = JSON.parse(loginJson);
  const accountNo = loginObj.accountNo;
  const pwd = loginObj.pwd;
  //根据账号查询用户名是否存在
  // XUser selectUser = userDao.selectByAcccountNo(accountNo);
  const selectUser = null
  const result = {}

  if (selectUser == null) {
    result.accountMsg = '用户名不存在';
  }
  // }else if (!pwd.equals(selectUser.getPwd())){
  //   result.put("pwdMsg", "用户名密码错误");
  // }else {
  //   result.put("user",selectUser);
  // }
  console.log(JSON.stringify(result));
  res.json(result);
}

exports.postSignin = function (req, res, next) {
  this.validateSignin(req, res, next);

}

exports.getSignout = function (req, res, next) {

}

exports.getSignup = function (req, res, next) {

  res.render('drug/pc/signup');
}

exports.validateSignup = function (req, res, next) {
  //获取form表单数据
  console.log(req.body.loginObj);
  const loginJson = req.body.loginObj;
  //JSON字符串序列化成JSON对象
  const loginObj = JSON.parse(loginJson);
  const accountNo = loginObj.accountNo;
  const pwd = loginObj.pwd;
  //根据账号查询用户名是否存在
  // XUser selectUser = userDao.selectByAcccountNo(accountNo);
  const selectUser = null
  const result = {}

  if (selectUser == null) {
    result.accountMsg = '用户名不存在';
  }
  // }else if (!pwd.equals(selectUser.getPwd())){
  //   result.put("pwdMsg", "用户名密码错误");
  // }else {
  //   result.put("user",selectUser);
  // }
  console.log(JSON.stringify(result));
  res.json(result);
}

exports.postSignup = function (req, res, next) {
  // this.validateSignup(req, res, next);
  var User = DB.get("User");
  var user = req.body;
  console.log(user)
  user.registertime = new Date();
  //加密，密码不加密
  User.where({ email: user.email.trim() }, function (err, result) {
    if (err) {
      next(err);
    } else {
      if (result && result.length > 0) {
        res.render('signup', { message: '邮箱不能重复，请更换邮箱' });
      } else {
        var sha1 = crypto.createHash('sha1');
        sha1.update(user.password);
        user.password = sha1.digest('hex');
        console.log(user)
        User.insert(user, function (err, result) {
          if (err) {
            next(err);
          } else {
            res.redirect("/");
          }
        });
      }
    }
  });
}

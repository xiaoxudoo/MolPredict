var crypto = require("crypto");


function getClientIp(req) {
  return req.connection.remoteAddress || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

exports.getSignin = function (req, res, next) {
  res.render('drug/pc/signin');
}

exports.postSignin = function (req, res, next) {
  const User = DB.get("User");
  const params = req.body;
  const name = params.email;
  const password = params.password;

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let sha1 = crypto.createHash('sha1');
  sha1.update(password);
  params.password = sha1.digest('hex');
  User.where(params, function (err, result) {
    if (err) {
      next(err);
    } else {
      if (result && result.length > 0) {
        req.flash('success', '登录成功');
        let user = result[0];
        delete user.password;
        req.session.user = user;
        // 更新用户登录信息
        const ip_ = getClientIp(req);
        console.log(ip_);
        const params = { id_: result[0].id_, lastlogintime: new Date(), lastloginip: ip_ };
        User.update(params);
        res.redirect("/");
      } else {
        req.flash('error', '用户名或密码错误')
        return res.redirect('back')
      }
    }
  });
}

exports.getSignout = function (req, res, next) {
  req.session.user = null
  req.flash('success', '登出成功')
  // 登出成功后跳转到主页
  res.redirect('/signin')
}

exports.getSignup = function (req, res, next) {

  res.render('drug/pc/signup');
}

exports.postSignup = function (req, res, next) {
  const User = DB.get("User");
  const user = req.body;
  const username = user.username.trim();
  const email = user.email.trim();
  const password = user.password.trim();
  const repassword = user.repassword.trim();
  const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  try {
    if (!(username.length >= 1 && username.length <= 20)) {
      throw new Error('用户名请限制在 1-20 个字符')
    }
    if (!emailReg.test(email)) {
      throw new Error('邮箱格式不正确')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/signup')
  }
  // 验证邮箱是否重复
  User.where({ email: user.email.trim() }, function (err, result) {
    if (err) {
      next(err);
    } else {
      if (result && result.length > 0) {
        req.flash('error', '邮箱不能重复，请更换邮箱');
        return res.redirect('/signup');
      } else {
        var sha1 = crypto.createHash('sha1');
        sha1.update(user.password);
        user.password = sha1.digest('hex');
        user.registertime = new Date();
        User.insert(user, function (err, result) {
          if (err) {
            next(err);
          } else {
            res.redirect("/signin");
          }
        });
      }
    }
  });
}

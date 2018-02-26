const crypto = require("crypto");
const { pvcount } = require('../utils/common');
const logger = require('../utils/logger');
function getClientIp(req) {
  return req.connection.remoteAddress || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

exports.getSignin = function (req, res, next) {
  res.render('drug/pc/signin', {'accesscount': pvcount(0)});
}

exports.postSignin = function (req, res, next) {
  const User = DB.get("User");
  const params = req.body;
  const name = params.email;
  const password = params.password;

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('Please fill in the user name.')
    }
    if (!password.length) {
      throw new Error('Please fill in the password.')
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
        req.flash('success', 'Logout success.');
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
        req.flash('error', 'Incorrect username or password.')
        return res.redirect('back')
      }
    }
  });
}

exports.getSignout = function (req, res, next) {
  req.session.user = null
  req.flash('success', 'Logout Success!')
  // 登出成功后跳转到主页
  res.redirect('/signin')
}

exports.getSignup = function (req, res, next) {
  res.render('drug/pc/signup', {'accesscount': pvcount(0)});
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
      throw new Error('Please limit the user name to 1-20 characters.')
    }
    if (!emailReg.test(email)) {
      throw new Error('Incorrect email format.')
    }
    if (password.length < 6) {
      throw new Error('Password at least 6 characters.')
    }
    if (password !== repassword) {
      throw new Error('Entered passwords differ.')
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
        req.flash('error', 'The emailcannot be duplicated, please change the email.');
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

exports.home = function (req, res, next) {
  const Order = DB.get("Order");
  const userid = req.session.user.id_;
  Order.where({ userid }, {'createTime': 'DESC'}, function (err, result) {
    if (err) {
      next(err);
    } else {
      if (result && result.length > 0) {
        const tox_result = [], opt_result = [];
        result.forEach(element => {
          const parameters = JSON.parse(element.parameters);
          if(parameters.calType == 'molTox') {
            tox_result.push(element);
          } else if(parameters.calType == 'molOpt') {
            opt_result.push(element);
          }
        });
        res.render('drug/pc/home', { 'tox_orders': tox_result, 'opt_orders': opt_result, 'accesscount': pvcount(0) });
      }
    }
  });
}

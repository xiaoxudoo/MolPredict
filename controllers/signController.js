const crypto = require("crypto");
const nodemailer = require('nodemailer');
const ccap = require('ccap');
const LRU = require('lru-cache')
const uuid = require("node-uuid");
const { pvcount } = require('../utils/common');
const logger = require('../utils/logger');
const { email_config } = require('../config');
function getClientIp(req) {
  return req.connection.remoteAddress || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};
const cache = LRU({
  max: 100,
  maxAge: 1000 * 60 * 60
})

exports.captcha = function (req, res, next) {
  const ary = ccap({
    width: 200,

    height: 60,

    offset: 30,

    quality: 100,

    fontsize: 57
  }).get();

  const text = ary[0].toLowerCase();
  const buffer = ary[1];

  req.session.verifycode = text;
  res.send(buffer);
}

exports.getSignin = function (req, res, next) {
  res.render('drug/pc/signin', { 'accesscount': pvcount(0) });
}

exports.postSignin = function (req, res, next) {
  const User = DB.get("User");
  const params = req.body;
  const name = params.email;
  const password = params.password;
  const captcha = params.captcha.toLowerCase();
  // 校验参数
  try {
    if (!name.length) {
      throw new Error('Please fill in the user name.')
    }
    if (!password.length) {
      throw new Error('Please fill in the password.')
    }
    if (captcha !== req.session.verifycode) {
      throw new Error('Verify Code is not right!')
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
  res.render('drug/pc/signup', { 'accesscount': pvcount(0) });
}

exports.postSignup = function (req, res, next) {
  const User = DB.get("User");
  const user = req.body;
  const username = user.username.trim();
  const email = user.email.trim();
  const password = user.password.trim();
  const repassword = user.repassword.trim();
  const captcha = user.captcha.toLowerCase();
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
    if (captcha !== req.session.verifycode) {
      throw new Error('Verify Code is not right!')
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
        req.flash('error', 'The email cannot be duplicated, please change the email.');
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

exports.getSearch_pass = function (req, res, next) {
  res.render('drug/pc/search_pass', { 'accesscount': pvcount(0) });
}

exports.postSearch_pass = function (req, res, next) {
  const User = DB.get("User");
  const email = req.body.email.trim();
  const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  try {
    if (!emailReg.test(email)) {
      throw new Error('Incorrect email format.')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }
  // 验证邮箱是否重复
  User.where({ email }, function (err, result) {
    if (err) {
      next(err);
    } else {
      if (result && result.length > 0) {
        // 生产token
        const username = result[0].username
        const token = uuid.v1();
        cache.set(email, token);
        console.log(cache.get(email))
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: email_config.host,
          port: email_config.port,
          secure: email_config.secure,
          auth: {
            user: email_config.user,
            pass: email_config.pwd
          }
        });

        const html = `hi：${username}<br>
        We received your request to reset the password in Xundrug. Please click the link below to reset the password within 24 hours:<br>
        <a href='http://xundrug.cn/reset_pass?key=${token}&email=${email}'>RESET PASSWORD</a><br>
        If you do not fill in the registration information in Xundurg, it means that someone has abused your email address. <br>
        Please delete this email. We are sorry for the inconvenience caused to you.<br><br>
        best~`;
        // setup email data with unicode symbols
        let mailOptions = {
          from: `"Xundrug" <${email_config.user}>`, // sender address
          to: email, // list of receivers
          subject: 'Xundrug reset password', // Subject line
          text: html,
          html: html
        };

        // send mail with defined transport object
        // transporter.sendMail(mailOptions, (error, info) => {
        //   if (error) {
        //     return console.log(error);
        //   }
        //   console.log('Message %s sent: %s', info.messageId, info.response);
        //   req.flash('success', 'We have sent an email to your email address. Please click the link within 24 hours to reset the password.');
        //   return res.redirect('back');
        // });
        req.flash('success', 'We have sent an email to your email address. Please click the link within 24 hours to reset the password.');
        return res.redirect('back');
      } else {
        req.flash('error', 'The email is not exist!');
        return res.redirect('back');
      }
    }
  });
}

exports.getReset_pass = function (req, res, next) {
  const key = req.query.key && req.query.key.trim();
  const email = req.query.key && req.query.email.trim();
  if (!key || !email) {
    req.flash('success', 'The information is incorrect and the password cannot be reset.');
  } else {
    const token = cache.get(email);
    console.log(token)
    if (token != key) {
      req.flash('success', 'The information is incorrect and the password cannot be reset.');
    }
  }
  res.render('drug/pc/reset_pass', { 'accesscount': pvcount(0) });
}

exports.postReset_pass = function (req, res, next) {
  const User = DB.get("User");
  const key = req.body.key && req.body.key.trim();
  // const email = req.body.email && req.body.email.trim();
  const email = req.body.email;
  const password = req.body.password && req.body.password.trim();
  const repassword = req.body.repassword && req.body.repassword.trim();
  try {
    if (password.length < 6) {
      throw new Error('Password at least 6 characters.')
    }
    if (password !== repassword) {
      throw new Error('Entered passwords differ.')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }
  if (!key || !email) {
    req.flash('success', 'The information is incorrect and the password cannot be reset.');
    return res.redirect('back');
  } else {
    const token = cache.get(email);
    console.log(token)
    if (token != key) {
      req.flash('success', 'The information is incorrect and the password cannot be reset.');
      return res.redirect('back');
    } else {
      cache.set(email, null);
      let sha1 = crypto.createHash('sha1');
      sha1.update(password);
      const digestPassword = sha1.digest('hex');
      console.log('debug03')
      User.where({ email }, function (err, result) {
        if (err) {
          next(err);
        } else {
          if (result && result.length > 0) {
            let user = result[0];
            // 更新用户登录信息
            const params = { id_: result[0].id_, password: digestPassword };
            User.update(params, function(err, result) {
              if(err) {
                next(err);
              } else {
                res.redirect("/signin");
              }
            });
          } else {
            req.flash('error', 'Incorrect email.')
            return res.redirect('back')
          }
        }
      });
    }
  }
}

exports.home = function (req, res, next) {
  const Order = DB.get("Order");
  const userid = req.session.user.id_;
  Order.where({ userid }, { 'createTime': 'DESC' }, function (err, result) {
    if (err) {
      next(err);
    } else {
      if (result && result.length > 0) {
        const tox_result = [], opt_result = [];
        result.forEach(element => {
          const parameters = JSON.parse(element.parameters);
          if (parameters.calType == 'molTox') {
            tox_result.push(element);
          } else if (parameters.calType == 'molOpt') {
            opt_result.push(element);
          }
        });
        res.render('drug/pc/home', { 'tox_orders': tox_result, 'opt_orders': opt_result, 'accesscount': pvcount(0) });
      }
    }
  });
}

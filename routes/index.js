var express = require('express');
var router = express.Router();
var toxController = require('../controllers/toxController');
var optController = require('../controllers/optController');
var signController = require('../controllers/signController');
const check = require('../middlewares/check');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  res.render('drug/pc/index');
});

router.get('/home', check.checkLogin, function(req, res, next) {
  res.render('drug/pc/home');
});

// login/logout/register
router.get('/signin', check.checkNotLogin, signController.getSignin);
router.post('/signin', check.checkNotLogin, signController.postSignin);
router.get('/signout', check.checkLogin, signController.getSignout);
router.get('/signup', check.checkNotLogin, signController.getSignup);
router.post('/signup', check.checkNotLogin, signController.postSignup);

// moltox
router.get('/moltox', toxController.index)
router.get('/moltox/about', toxController.about)
router.get('/moltox/run_example', toxController.run_example)
router.post('/moltox/silicotox', toxController.cal_tox);
router.get('/moltox/silicotox/:id', toxController.query_tox_result);

// molopt
router.get('/molopt', optController.index)
router.get('/molopt/about', optController.about)
router.get('/molopt/run_example', optController.run_example)
router.post('/molopt/silicoopt', optController.cal_opt_step_one);
router.post('/molopt/optimize', optController.cal_opt_step_two);
router.get('/moltox/optimize/:id', optController.query_opt_result);

module.exports = router;

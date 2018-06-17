var express = require('express');
var router = express.Router();
var toxController = require('../controllers/toxController');
var optController = require('../controllers/optController');
var pkaController = require('../controllers/pkaController');
var signController = require('../controllers/signController');
var orderController = require('../controllers/orderController');
const check = require('../middlewares/check');
const { pvcount } = require('../utils/common');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  res.render('drug/pc/index', {'accesscount': pvcount(1)});
});

router.get('/home', check.checkLogin, signController.home);

// login/logout/register
router.get('/signin', check.checkNotLogin, signController.getSignin);
router.post('/signin', check.checkNotLogin, signController.postSignin);
router.get('/signout', check.checkLogin, signController.getSignout);
router.get('/signup', check.checkNotLogin, signController.getSignup);
router.post('/signup', check.checkNotLogin, signController.postSignup);
router.get('/captcha/:id', signController.captcha);
router.get('/search_pass', signController.getSearch_pass);
router.post('/search_pass', signController.postSearch_pass);
router.get('/reset_pass', signController.getReset_pass);
router.post('/reset_pass', signController.postReset_pass);
// moltox
router.get('/moltox', toxController.index)
router.get('/moltox/about', toxController.about)
router.get('/moltox/run_example', toxController.run_example)
router.post('/moltox/silicotox', toxController.cal_tox);
router.get('/moltox/silicotox/:id', toxController.query_tox_result);

// molopt
router.get('/molopt', optController.index)
router.get('/molopt/about', optController.about)
router.get('/molopt/tutorial', optController.tutorial)
router.get('/molopt/run_example', optController.run_example)
router.post('/molopt/silicoopt', optController.cal_opt_step_one);
router.post('/molopt/optimize', optController.cal_opt_step_two);
router.get('/molopt/optimize/:id', optController.query_opt_result);

// molpka
router.get('/molpka', pkaController.index)
router.get('/molpka/about', pkaController.about)
router.get('/molpka/tutorial', pkaController.tutorial)
router.get('/molpka/run_example', pkaController.run_example)
router.post('/molpka/silicoopt', pkaController.cal_opt_step_one);
router.post('/molpka/optimize', pkaController.cal_opt_step_two);
router.get('/molpka/optimize/:id', pkaController.query_opt_result);


// order
router.get('/delete/:id', orderController.deleteOrder);

module.exports = router;

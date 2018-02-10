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

// login/logout/register
router.get('/signin', check.checkNotLogin, signController.getSignin);
router.post('/signin', check.checkNotLogin, signController.postSignin);
router.get('/signout', check.checkLogin, signController.getSignout);
router.get('/signup', check.checkNotLogin, signController.getSignup);
router.post('/signup', check.checkNotLogin, signController.postSignup);

// moltox
router.get('/moltox', toxController.prediction)
router.get('/moltox/about', toxController.theory)
router.get('/moltox/run_example', toxController.run_example)
router.post('/moltox/silicotox', check.checkLogin, toxController.formSubmit_absorption);

// molopt
router.get('/molopt', optController.prediction)
router.get('/molopt/about', optController.theory)
router.get('/molopt/run_example', optController.run_example)
router.post('/molopt/silicoopt', check.checkLogin, optController.formSubmit_absorption);
router.post('/molopt/optimize', check.checkLogin, optController.formSubmit_optimisation);

module.exports = router;

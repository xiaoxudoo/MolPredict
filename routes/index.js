var express = require('express');
var router = express.Router();
var toxController = require('../controllers/toxController');
var optController = require('../controllers/optController');
var optController_icdrug = require('../controllers/optController_icdrug');
var dhopController = require('../controllers/dhopController');
var frepController = require('../controllers/fragrepController');
var fgrowController = require('../controllers/fraggrowController');
var gcnController = require('../controllers/gcnController');
var pkbController = require('../controllers/pkbController');
var pkaController = require('../controllers/pkaController');
var hopController = require('../controllers/hopController')
// var signController = require('../controllers/signController');
var orderController = require('../controllers/orderController');
var sampleController = require('../controllers/sampleController');
var gpkaController = require('../controllers/gpkaController');


const check = require('../middlewares/check');
const { pvcount } = require('../utils/common');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  res.render('drug/pc/index', {'accesscount': pvcount(1)});
});

// router.get('/home', check.checkLogin, signController.home);

// // login/logout/register
// router.get('/signin', check.checkNotLogin, signController.getSignin);
// router.post('/signin', check.checkNotLogin, signController.postSignin);
// router.get('/signout', check.checkLogin, signController.getSignout);
// router.get('/signup', check.checkNotLogin, signController.getSignup);
// router.post('/signup', check.checkNotLogin, signController.postSignup);
// router.get('/captcha/:id', signController.captcha);
// router.get('/search_pass', signController.getSearch_pass);
// router.post('/search_pass', signController.postSearch_pass);
// router.get('/reset_pass', signController.getReset_pass);
// router.post('/reset_pass', signController.postReset_pass);

// order
router.get('/delete/:id', orderController.deleteOrder);

// moltox
router.get('/moltox', toxController.index)
router.get('/moltox/about', toxController.about)
router.get('/moltox/run_example', toxController.run_example)
router.post('/moltox/silicotox', toxController.cal_tox);
router.get('/moltox/silicotox/:id', toxController.query_tox_result);

// gpka 
router.get('/molgpka', gpkaController.index)
router.get('/molgpka/about', gpkaController.about)
router.get('/molgpka/tutorial',gpkaController.tutorial)
router.get('/molgpka/run_example', gpkaController.run_example)
router.post('/molgpka/silicopka', gpkaController.cal_pka);
router.get('/molgpka/silicopka/:id', gpkaController.query_pka_result);
// molopt
router.get('/molopt', optController.index)
router.get('/molopt/about', optController.about)
router.get('/molopt/tutorial', optController.tutorial)
router.get('/molopt/run_example', optController.run_example)
router.post('/molopt/silicoopt', optController.cal_opt_step_one);
router.post('/molopt/optimize', optController.cal_opt_step_two);
router.get('/molopt/optimize/:id', optController.query_opt_result);

// molopt_icdrug
router.get('/molopt_icdrug', optController_icdrug.index)
router.get('/molopt_icdrug/about', optController_icdrug.about)
router.get('/molopt_icdrug/tutorial', optController_icdrug.tutorial)
router.get('/molopt_icdrug/run_example', optController_icdrug.run_example)
router.post('/molopt_icdrug/silicoopt', optController_icdrug.cal_opt_step_one);
router.post('/molopt_icdrug/optimize', optController_icdrug.cal_opt_step_two);
router.get('/molopt_icdrug/optimize/:id', optController_icdrug.query_opt_result);

// molpkb
router.get('/molpkb', pkbController.index)
router.get('/molpkb/about', pkbController.about)
router.get('/molpkb/tutorial', pkbController.tutorial)
router.get('/molpkb/run_example', pkbController.run_example)
router.post('/molpkb/silicoopt', pkbController.cal_opt_step_one);
router.post('/molpkb/optimize', pkbController.cal_opt_step_two);
router.get('/molpkb/optimize/:id', pkbController.query_opt_result);
// molpka
router.get('/molpka', pkaController.index)
router.get('/molpka/about', pkaController.about)
router.get('/molpka/run_example', pkaController.run_example)
router.post('/molpka/silicotox', pkaController.cal_tox);
router.get('/molpka/silicotox/:id', pkaController.query_tox_result);

// molhop
router.get('/molhop', hopController.index)
router.get('/molhop/about', hopController.about)
router.get('/molhop/tutorial', hopController.tutorial)
router.get('/molhop/run_example', hopController.run_example)
router.post('/molhop/silicoopt', hopController.cal_opt_step_one);
router.post('/molhop/optimize', hopController.cal_opt_step_two);
router.get('/molhop/optimize/:id', hopController.query_opt_result);

// mol3dopt
//router.get('/mol3dopt', dhopController.index)
//router.get('/mol3dopt/about', dhopController.about)
//router.get('/mol3dopt/tutorial',dhopController.tutorial)
//router.get('/mol3dopt/run_example', dhopController.run_example)
//router.post('/mol3dopt/silicoopt',dhopController.cal_opt_step_one);
//router.post('/mol3dopt/optimize', dhopController.cal_opt_step_two);
//router.get('/mol3dopt/optimize/:id', dhopController.query_opt_result);

// fragrep 
router.get('/fragrep', frepController.index)
router.get('/fragrep/about', frepController.about)
router.get('/fragrep/tutorial',frepController.tutorial)
router.get('/fragrep/run_example', frepController.run_example)
router.post('/fragrep/silicoopt',frepController.cal_opt_step_one);
router.post('/fragrep/optimize', frepController.cal_opt_step_two);
router.get('/fragrep/optimize/:id', frepController.query_opt_result);

// fraggrow 
router.get('/fraggrow', fgrowController.index)
router.get('/fraggrow/about', fgrowController.about)
router.get('/fraggrow/tutorial',fgrowController.tutorial)
router.get('/fraggrow/run_example', fgrowController.run_example)
router.post('/fraggrow/silicoopt',fgrowController.cal_opt_step_one);
router.post('/fraggrow/optimize', fgrowController.cal_opt_step_two);
router.get('/fraggrow/optimize/:id', fgrowController.query_opt_result);

// gcnpka
router.get('/gcnpka', gcnController.index)
router.get('/gcnpka/about', gcnController.about)
router.get('/gcnpka/tutorial',gcnController.tutorial)
router.get('/gcnpka/run_example', gcnController.run_example)
router.post('/gcnpka/silicoopt',gcnController.cal_opt_step_one);
//router.post('/gcnpka/silicoopt',gcnController.cal_opt_step_two);
//router.post('/gcnpka/silicoopt',gcnController.cal_tox);
router.post('/gcnpka/optimize', gcnController.cal_opt_step_two);
router.get('/gcnpka/optimize/:id', gcnController.query_opt_result);

// order
router.get('/delete/:id', orderController.deleteOrder);
// sample
router.get('/sample', sampleController.index)
router.get('/sample/about', sampleController.about)

module.exports = router;

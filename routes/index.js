var express = require('express');
var router = express.Router();
var toxController = require('../controllers/toxController');
var optController = require('../controllers/optController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  res.render('drug/pc/about');
});

// pkmol

router.get('/moltox', toxController.prediction)
router.get('/moltox/about', toxController.theory)
router.get('/moltox/run_example', toxController.run_example)
router.post('/moltox/silicotox', toxController.formSubmit_absorption);

router.get('/molopt', optController.prediction)
router.get('/molopt/about', optController.theory)
router.get('/molopt/run_example', optController.run_example)
router.post('/molopt/silicotox', optController.formSubmit_absorption);
router.post('/molopt/silicoopt', optController.formSubmit_optimisation);


module.exports = router;

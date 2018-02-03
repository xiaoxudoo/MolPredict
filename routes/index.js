var express = require('express');
var router = express.Router();
var drugController = require('../controllers/drugController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  res.render('drug/pc/about');
  // res.redirect('/moltox')
});

// pkmol

router.get('/moltox', drugController.prediction)
router.get('/moltox/about', drugController.theory)
router.get('/moltox/run_example', drugController.run_example)
router.post('/moltox/silicotox', drugController.formSubmit_absorption);

router.get('/molopt', drugController.prediction)
router.get('/molopt/about', drugController.theory)
router.get('/molopt/run_example', drugController.run_example)
router.post('/molopt/silicotox', drugController.formSubmit_absorption);
router.post('/molopt/silicoopt', drugController.formSubmit_optimisation);


module.exports = router;

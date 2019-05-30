var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
	console.log('index route');
	res.sendFile('public/index.html',{root: './'});
});

module.exports = router;

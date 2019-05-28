var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/network', function(req, res, next) {
	res.json(networkScheme);
	//console.log('hit /api/network');
	//res.json({"name":"lalka"});
});

module.exports = router;

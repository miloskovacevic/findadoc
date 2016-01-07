var express = require('express');
var router = express.Router();

router.get('/add', function (req, res) {
    res.render('addcategory');
    console.log('index u konzoli');
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log('doktori u konzoli');
    res.render('doctors');
});

module.exports = router;

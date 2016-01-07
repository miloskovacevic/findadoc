var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function (err, result) {
    console.log('Cassandra Connected!');
});

router.get('/', function (req, res) {
    console.log('doktori u konzoli');

    // kreiramo upit
    var query = 'SELECT * FROM findadoc.doctors';
    client.execute(query, [], function (err, results) {
        if(err) {
            res.status(404).send({msg: err});
        }else{
            res.render('doctors',{
                doctors: results.rows
            });
        }
    });

});

router.get('/add', function(req, res){
    res.render('adddoctor');
});

router.get('/details/:id', function (req, res) {
    console.log('Pritisnuo na id: ' + req.params.id);
    var query = 'SELECT * FROM findadoc.doctors WHERE doc_id = ?';
    client.execute(query, [req.params.id], function (err, result) {
        if(err){
            res.status(404).send({msg: err});
        }else {
            res.render('details', {
                doctor: result.rows['0']
            });
        }
    });

});

module.exports = router;

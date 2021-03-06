var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var flash = require('connect-flash');
var cassandra = require('cassandra-driver');


var app = express();

var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function (err, result) {
    console.log('Cassandra Connected!');
});

//rute
var index = require('./routes/index');
var doctors = require('./routes/doctors');
var categories = require('./routes/categories');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// we want access to categories everywhere
var query = 'SELECT * FROM findadoc.categories';
client.execute(query, [], function (err, results) {
    if(err) {
        res.status(404).send({msg: err});
    }else{
        app.locals.cats = results.rows;
    }
});

app.use('/', index);
app.use('/doctors', doctors);
app.use('/categories', categories);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

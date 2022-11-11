const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const bodyParser = require("body-parser");
const backend = require('./index');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:8082',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const app = express();
app.use(cors(corsOptions))
app.set('trust proxy', 1)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

backend(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

module.exports = app;

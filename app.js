const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const csrf = require('csurf')
const logger = require('morgan');
const bodyParser = require("body-parser");
const staticsPath = __dirname + '/public/';
const helmet = require('helmet');
const Keygrip = require('keygrip')

const app = express();
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

app.use(cookieParser())
app.use(csrf({
    cookie: true
}))
app.set('trust proxy', 1)
app.use(cookieSession({
    httpOnly: true,
    keys: new Keygrip([], 'SHA384', 'base64'),
    name: 'sessionId',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production'
}));
app.use(function (req, res, next) {
    if (req.session.id) {

    } else {
        req.session = {
            "id": '_' + Math.random().toString(36).substr(2, 9),
            "csrf": req.csrfToken()
        }
    }
    next()
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticsPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./Http/routers')(app);

app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

module.exports = app;

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const csrf = require('csurf')
const logger = require('morgan');
const bodyParser = require("body-parser");
const staticPath = __dirname + '/public/';
const helmet = require('helmet');
const Keygrip = require('keygrip')
const history = require('connect-history-api-fallback');
const backend = require('./http');

const app = express();
app.use(function (req, res, next) {
    next()
})
app.set('trust proxy', 1)
app.use(cookieSession({
    httpOnly: true,
    keys: new Keygrip(['', ''], 'SHA384', 'base64'),
    name: 'sessionId',
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 15,
    signed: true,
    secure: process.env.NODE_ENV === 'production'
}));
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

app.use(cookieParser('NPYnBp1UJM'))
const csrfCookieValidator = function (req) {
    return req.session.csrf_token;
};
app.use(csrf({
    cookie: {
        httpOnly: true,
        signed: true,
    },
    value: csrfCookieValidator,
}))
app.use(function (req, res, next) {
    if (req.session.isAuthenticated && req.path === '/') {
        return res.redirect(backend.authorization.buildRedirectFor(req, res))
    }

    if (backend.authorization.isProtectedPath(req.path)) {
        if (!req.session.isAuthenticated) {
            return res.redirect('/?authentication=true')
        }

        if (!backend.authorization.isAuthorized(req)) {
            return res.redirect(backend.authorization.buildRedirectFor(req, res));
        }
    }

    if (!req.session.id) {
        req.session = {
            "id": '_' + Math.random().toString(36).substr(2, 9),
            "csrf_token": req.csrfToken()
        }
    }

    next()
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./http')(app);

app.use(history())
app.use(express.static(staticPath));
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

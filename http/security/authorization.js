const paths = require('../routes/app').paths;
const jwt = require('./jwt-generator');

const isProtectedPath = (path) => {
    return existMatchFor(paths['protected'], path);
};

function existMatchFor(structure, path) {
    let isProtected = false;

    Object.entries(structure).forEach(([key, value]) => {
        if (typeof value === 'object') {
            const existMatch = existMatchFor(value, path);

            if (existMatch) {
                isProtected = existMatch
            }
        }

        if (value === path) {
            isProtected = true;
        }
    });

    return isProtected;
}

const isAuthorized = (req) => {
    const access = jwt.decode(req.cookies.access_token);

    const protectedPaths = paths['protected'];

    let isAuthorized = false;

    access.roles.forEach((role) => {
        if (!protectedPaths[role.toLowerCase()]) {
            return;
        }

        if (existMatchFor(protectedPaths, req.path) || existMatchFor(protectedPaths[role.toLowerCase()], req.path)) {
            isAuthorized = true;
        }
    });

    return isAuthorized;
}

const buildRedirectFor = (req, res) => {
    let access = '';

    if (req.cookies && req.cookies['access_token']) {
        access = jwt.decode(req.cookies.access_token);
    } else {
        const cookieHeader = res.getHeader('set-cookie');

        access = jwt.decode(cookieHeader.substring(cookieHeader.indexOf('=') + 1, cookieHeader.indexOf(';')));
    }

    let redirectPath = ''

    if (access.roles.length > 1) {
        redirectPath = paths.protected.switchAccount.path;
    } else {
        if (access.roles[0] === 'CUSTOMER') {
            redirectPath = paths.protected.customer.defaultPath;
        }

        if (access.roles[0] === 'ADMIN') {
            redirectPath = paths.protected.admin.defaultPath;
        }
    }

    return redirectPath
}

module.exports = {isProtectedPath, isAuthorized, buildRedirectFor};

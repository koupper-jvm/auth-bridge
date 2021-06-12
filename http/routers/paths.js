const controllers = require('../index').controllers;
const authentication = require('../index').authentication;

/**
 * These are namespaces and the 'public' or 'protected' keys defines
 * the visibility of their inner-objects paths . The nested-objects represent
 * the level of their paths, just like a documentary API implementation.
 */
const paths = {
    public: {
        login: {
            path: '/login'
        },
        signUp: {
            path: '/singUp'
        },
        logout: {
            path: '/logout'
        }
    },
    protected: {
        switchAccount: {
            path: '/profile/choice'
        },
        customer: {
            profile: {
                path: '/user/profile'
            },
            defaultPath: '/user/profile'
        },
        admin: {
            defaultPath: '/admin/profile'
        }
    }
}

const routes = (app) => {
    app.post(paths.public.login.path, authentication.login);
    app.get(paths.public.logout.path, authentication.logout);
    app.post(paths.public.signUp.path, controllers.user.signUp);
}

module.exports = {paths, routes}

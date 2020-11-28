const expressJwt    = require('express-jwt');
const secretExpr    = require('./tsconfig.json');

function jwt(req, res, next) {
    let {secret} = secretExpr;
    // Make sure to block access to some routes if not properly connected to the system
    if (!req && next && req.url.includes('socket.io')) {
        return next()
    }
    else {
        return expressJwt({secret}).unless({
            path: [
                //Public Routes that doesn't request connexion to allow access
                '/',
                '/api-docs.json',
                '/api-docs',
                '/auth/login',
                '/api-docs',
            ]
        })
    }
}

module.exports = jwt;

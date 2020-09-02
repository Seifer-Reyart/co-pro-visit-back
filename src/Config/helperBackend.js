const expressJwt    = require('express-jwt');
const secretExpr    = require('./tsconfig.json');

function jwt() {
    let {secret} = secretExpr;
    // Make sure to block access to some routes if not properly connected to the system
    return expressJwt({secret}).unless({
        path: [
            //Public Routes that doesn't request connexion to allow access
            '/',
            '/api-docs.json',
            '/api-docs',
            '/auth/login',
            '/api-docs'
        ]
    })
}

module.exports = jwt;

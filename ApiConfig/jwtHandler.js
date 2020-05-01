const expressJwt    = require('express-jwt');
const secretExpr    = require('./tsconfig');

function jwt() {
    let {secret} = secretExpr;
    // bloc API access if not properly connected. Exept for those ApiRoutes in 'path' param
    return expressJwt({secret}).unless({
        path: [
            //Public Routes that doesn't request connexion to allow access
            '/',
            '/user/register',
            '/user/login',
        ]
    })
}

module.exports = jwt;
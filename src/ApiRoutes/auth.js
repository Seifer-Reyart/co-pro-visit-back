/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');

/************************/
/* import local modules */
/************************/

const {login, createAdmin} = require('../ApiControllers/auth');

/***************/
/* init router */
/***************/

let router = express.Router();



/**********/
/* Routes */
/**********/

/* login */

/**
 * @typedef LOGIN
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} password.required - mot de passe - eg: t5@VuLs#Sbght8yN
 */
/**
 * Cette route permet de se connecter, aucun JWT (Json Web Token) nécessaire.
 * @route POST /auth/login
 * @group auth - login
 * @param {LOGIN.model} email.body.required - email
 * @param {LOGIN.model} password.body.required - mot de passe
 * @returns {object} 200 - un objet avec les clés suivantes {success: true, message: 'connexion réussie', user: object, token: string}
 * @returns {Error}  404 - {success: false, message: 'utilisateur introuvable'}
 * @returns {Error}  403 - {success: false, message: 'mot de passe incorrect'}
 * @returns {Error}  404 - {success: false, message: 'utilisateur introuvable'}
 * @produces application/json
 * @consumes application/json
 */

router.post('/login', login);

/*create Admin*/

router.post('/admin', createAdmin)

/* Export '/auth' routes */

module.exports = router;

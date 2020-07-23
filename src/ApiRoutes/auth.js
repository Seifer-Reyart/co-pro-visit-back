/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');

/************************/
/* import local modules */
/************************/

const login = require('../ApiControllers/auth').login;

/***************/
/* init router */
/***************/

let router = express.Router();

/* login */

/**
 * @typedef LOGIN
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} password.required - mot de passe - eg: t5@VuLs#Sbght8yN
 */
/**
 * Cette route permet de se connecter, aucun JWT necessaire.
 * @route POST /auth/login
 * @group auth - login
 * @param {LOGIN.model} email.body.required - email
 * @param {LOGIN.model} password.body.required - mot de passe
 * @returns {object} 200 - un objet avec les clés suivantes {success: true, message: 'connexion réussie', user: object}
 * @returns {Error}  404 - {success: true, message: 'utilisateur introuvable'}
 * @returns {Error}  403 - {success: true, message: 'mot de passe incorrect'}
 * @produces application/json
 * @consumes application/json
 */

router.post('/login', login);


/* Export '/auth' routes */

module.exports = router;
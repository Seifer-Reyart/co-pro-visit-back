/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');

/************************/
/* import local modules */
/************************/

let {
    getCopro,
    getSyndics,
    getCourtiers
} = require('../ApiControllers/retrieve');

/***************/
/* init router */
/***************/
let router = express.Router();

/**
 * Cette route permet de récupérer un ou plusieurs Syndics selon le type de compte, JWT necessaire.
 * @route GET /retrieve/copro
 * @group Get_Data
 * @returns {object} 200 - {success: true, syndics: array of copros}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic ou gestionnaire ou courtier ou pcs  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun syndic trouvé  {success: false, message: 'aucune copro enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/copro', getCopro);

/**
 * Cette route permet de récupérer un ou plusieurs Syndics selon le type de compte, JWT necessaire.
 * @route GET /retrieve/syndic
 * @group Get_Data
 * @returns {object} 200 - {success: true, syndics: array of syndics}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin ou courtier ou prestataire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun syndic trouvé  {success: false, message: 'aucun syndic enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/syndic', getSyndics);

/**
 * Cette route permet de récupérer tout ou partie des courtiers selon le type de compte, JWT necessaire.
 * @route GET /retrieve/courtier
 * @group Get_Data
 * @returns {object} 200 - {success: true, courtiers: array of courtiers}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin ou syndic ou gestionnaire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun courtier trouvé  {success: false, message: 'aucun courtier enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/courtier', getCourtiers);

module.exports = router;

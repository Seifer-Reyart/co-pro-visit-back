/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');

/************************/
/* import local modules */
/************************/

let {
    getCopro,
    postCopro,
    getSyndics,
    postSyndic,
    getVisites,
    postVisite,
    getCourtiers,
    postCourtier,
    getGestionnaires,
    postGestionnaire,
    getEncoursSelect
} = require('../ApiControllers/retrieve');

/***************/
/* init router */
/***************/
let router = express.Router();

/**
 * Cette route permet de récupérer un ou plusieurs Syndics selon le type de compte, JWT necessaire.
 * @route GET /retrieve/copro
 * @group Get_Data
 * @returns {object} 200 - {success: true, copros: array of copros}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic ou gestionnaire ou courtier ou pcs  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun syndic trouvé  {success: false, message: 'aucun parc enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/copro', getCopro);

/**
 * Cette route permet de récupérer une copro via son _id, JWT necessaire.
 * @route POST /retrieve/copro
 * @group Get_Data
 * @param {COPRO.model} _id.body.required - _id
 * @returns {object} 200 - {success: true, copros: array of copros}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin ou syndic ou gestionnaire ou courtier ou pcs  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun syndic trouvé  {success: false, message: 'aucune copro enregistrée'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/copro', postCopro);

/**
 * Cette route permet de récupérer tout ou partie des Copros en cours de selection, selon le type de compte, JWT necessaire.
 * @route GET /retrieve/encours
 * @group Get_Data
 * @returns {object} 200 - {success: true, copros: array of copros}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic ou gestionnaire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun syndic trouvé  {success: false, message: 'aucun parc enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/encours', getEncoursSelect);

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
 * Cette route permet de récupérer un Syndic avec son parc et ses getionnaires, JWT necessaire.
 * @route POST /retrieve/syndic
 * @group Get_Data
 * @param {SYNDIC.model} _id.body.required - _id
 * @returns {object} 200 - {success: true, syndics: array of syndics}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin ou courtier ou prestataire ou architecte  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun syndic trouvé  {success: false, message: 'aucun syndic enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/syndic', postSyndic);

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

/**
 * Cette route permet de récupérer un courtier via son _id, JWT necessaire.
 * @route POST /retrieve/courtier
 * @group Get_Data
 * @param {COURTIER.model} _id.body.required - _id
 * @returns {object} 200 - {success: true, courtiers: array of courtiers}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin ou syndic ou gestionnaire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun courtier trouvé  {success: false, message: 'aucun courtier enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/courtier', postCourtier);

/**
 * Cette route permet de récupérer tout ou partie des gestionnaires selon le type de compte, JWT necessaire.
 * @route GET /retrieve/gestionnaire
 * @group Get_Data
 * @returns {object} 200 - {success: true, gestionnaires: array of courtiers}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun gestionnaire trouvé  {success: false, message: 'aucun gestionnaire enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/gestionnaire', getGestionnaires);

/**
 * Cette route permet de récupérer un gestionnaire via son _id, JWT necessaire.
 * @route POST /retrieve/gestionnaire
 * @group Get_Data
 * @param {GESTIONNAIRE.model} _id.body.required - _id
 * @returns {object} 200 - {success: true, gestionnaires: array of courtiers}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic ou admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun gestionnaire trouvé  {success: false, message: 'aucun gestionnaire enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/gestionnaire', postGestionnaire);

/**
 * Cette route permet de récupérer la liste des Visites, JWT necessaire.
 * @route GET /retrieve/visite
 * @group Get_Data
 * @returns {object} 200 - {success: true, visites: array of visites}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== architecte ou admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucune visite trouvée  {success: false, message: 'aucune visite enregistrée'}
 * @produces application/json
 * @security JWT
 */
router.get('/visite', getVisites);

/**
 * Cette route permet de récupérer une visite via son _id, JWT necessaire.
 * @route POST /retrieve/visite
 * @group Get_Data
 * @param {VISITE.model} _id.body.required - _id
 * @returns {object} 200 - {success: true, visites: array of visites}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== architecte ou admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucune visite trouvée  {success: false, message: 'aucune visite enregistrée'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/visite', postVisite);

module.exports = router;

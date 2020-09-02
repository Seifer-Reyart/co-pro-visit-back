/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');

/************************/
/* import local modules */
/************************/

let {
    demandeVisite,
    assignerVisite,
} = require('../ApiControllers/gestion');

/***************/
/* init router */
/***************/
let router = express.Router();

/**
 * @typedef VISITE
 * @property {string} architecteId.required - _id de l'architecte
 * @property {string} coproId.required - _id de la copro
 * @property {string} nomCopro.required - nom de la copro
 * @property {string} reference.required - reference/numero copro
 * @property {string} syndicId.required - _id du Syndic
 * @property {string} gestionnaireId - _id du Gestionnaire
 * @property {boolean} done - visite faite ou en attente
 */
/**
 * Cette route permet de déclencher une demande de visite, JWT necessaire.
 * @route POST /gestion/demande-visite
 * @group gestion
 * @param {VISITE.model} coproId.body.required - _id de la copro
 * @param {Visite.model} nomCopro.body.required - nom de la copro
 * @param {Visite.model} reference.body.required - reference/numero de la copro
 * @param {Visite.model} syndicId.body.required - _id du Syndic
 * @param {Visite.model} gestionnaireId.body - _id du Gestionnaire
 * @returns {object} 200 - {success: true, message: 'requête visite envoyée'}
 * @returns {Error}  400 - {success: false, message: 'erreur system', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== syndic ou gestionnaire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si visite existe  {success: false, message: 'une visite a déjà été demandé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/demande-visite', demandeVisite);

/**
 * Cette route permet d'assigner une visite à un architecte, JWT necessaire.
 * @route POST /gestion/assign-visite
 * @group gestion
 * @param {VISITE.model} coproId.body.required - _id de la copro
 * @param {Visite.model} architecteId.body.required - _id de l'architecte
 * @returns {object} 200 - {success: true, message: 'visite assignée'}
 * @returns {Error}  400 - {success: false, message: 'erreur system', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/assign-visite', assignerVisite);

module.exports = router;


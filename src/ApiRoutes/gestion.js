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
    desassignerVisite,
    demandeCourtier,
    assignerCourtierToCopro,
    assignerCourtierToSyndic,
    assignerPrestataireToSyndic,
} = require('../ApiControllers/gestion');

/***************/
/* init router */
/***************/
let router = express.Router();

/**
 * @typedef VISITE
 * @property {string} architecteId - _id de l'architecte
 * @property {string} coproId.required - _id de la copro
 * @property {string} nomCopro.required - nom de la copro
 * @property {string} reference.required - reference/numero copro
 * @property {string} syndicId.required - _id du Syndic
 * @property {string} gestionnaireId - _id du Gestionnaire
 * @property {date} demandeLe - date de création de la demande de visite
 * @property {date} faiteLe - date où la visite a été effectuée
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
 * @param {object} visites.body.required - {visites: [tableau des _id visite], architecteId: _id de l'architecte}
 * @returns {object} 200 - {success: true, message: 'visite(s) assignée(s)'}
 * @returns {Error}  400 - {success: true, message: 'une ou plusieurs visites non assignées', error: tableau des _id visites non assignés}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/assign-visite', assignerVisite);

/**
 * Cette route permet de désassigner une visite d'un architecte, JWT necessaire.
 * @route POST /gestion/unassign-visite
 * @group gestion
 * @param {object} visites.body.required - {visites: [tableau des _id visite], architecteId: _id de l'architecte}
 * @returns {object} 200 - {success: true, message: 'visite(s) supprimée(s)'}
 * @returns {Error}  400 - {success: true, message: 'une ou plusieurs visites n'ont pû être supprimées', error: tableau des _id visites non supprimées }
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/unassign-visite', assignerVisite);

/**
 * Cette route permet au Syndic de demander la création/assignation d'un courtier, JWT necessaire.
 * @route POST /gestion/demande-courtier
 * @group gestion
 * @param {string} nomSyndic.body.required - nom du Syndic
 * @param {string} firstName.body.required - prenom responsable courtier
 * @param {string} lastName.body.required - nom responsable courtier
 * @param {string} email.body.required - email responsable courtier
 * @param {string} phone.body.required - téléphone responsable courtier
 * @param {string} company.body.required - raison sociale courtier
 * @returns {object} 200 - {success: true, message: "le courtier a bien été assigné"}
 * @returns {Error}  401 - si dans token, role !== syndic ou gestionnaire  {success: false, message: 'erreur assigniation dans syndic', err: mongoose system log error}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/demande-courtier', demandeCourtier);

/**
 * Cette route permet d'assigner un Courtier à une Copro, JWT necessaire.
 * @route POST /gestion/copro-courtier
 * @group gestion
 * @param {VISITE.model} copro.body.required - _id de la copro
 * @param {Visite.model} courtier.body.required - _id du courtier
 * @returns {object} 200 - {success: true, message: "le courtier a bien été assigné"}
 * @returns {Error}  400 - {success: false, message: 'erreur assigniation dans courtier', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== syndic ou gestionnaire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - {success: false, message: 'erreur assigniation dans copro', err: mongoose system log error}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/copro-courtier', assignerCourtierToCopro);

/**
 * Cette route permet d'assigner un Courtier à un Syndic, JWT necessaire.
 * @route POST /gestion/syndic-courtier
 * @group gestion
 * @param {VISITE.model} syndic.body.required - _id du Syndic
 * @param {Visite.model} courtier.body.required - _id du courtier
 * @returns {object} 200 - {success: true, message: "le courtier a bien été assigné"}
 * @returns {Error}  400 - {success: false, message: 'erreur assigniation dans courtier', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'erreur assigniation dans syndic', err: mongoose system log error}
 * @returns {Error}  403 - {success: false, message: 'erreur assigniation dans syndic', err: mongoose system log error}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/syndic-courtier', assignerCourtierToSyndic);

/**
 * Cette route permet d'assigner un Prestataire à un Syndic, JWT necessaire.
 * @route POST /gestion/syndic-prestataire
 * @group gestion
 * @param {string} syndicId.body.required - _id du Syndic
 * @param {string} prestataireId.body.required - _id du prestataire
 * @returns {object} 200 - {success: true, message: "le courtier a bien été assigné"}
 * @returns {Error}  400 - {success: false, message: 'erreur assigniation dans prestataire', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'erreur assigniation dans syndic', err: mongoose system log error}
 * @returns {Error}  403 - {success: false, message: 'erreur', err: mongoose system log error}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/syndic-prestataire', assignerPrestataireToSyndic);

module.exports = router;


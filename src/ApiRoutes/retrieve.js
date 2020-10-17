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
    getOneVisite,
    getVisitesAll,
    getVisitesArchi,
    getVisitesUnassigned,
    getCourtiers,
    postCourtier,
    getArchitectes,
    postArchitecte,
    postOneIncident,
    postIncidentslist,
    getGestionnaires,
    postGestionnaire,
    getEncoursSelect,
    postEncoursSelect,
    getPrestataire,
    postPrestataire,
    getCoproCourtierBySyndic
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
 * @route GET /retrieve/encours-list
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
router.get('/encours-list', getEncoursSelect);

/**
 * Cette route permet de récupérer une Copro en cours de selection via son _id, JWT necessaire.
 * @route POST /retrieve/encours
 * @group Get_Data
 * @param {COPRO.model} _id.body.required - _id de la copro encours de selection
 * @returns {object} 200 - {success: true, copros: array of copros}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic ou gestionnaire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucun syndic trouvé  {success: false, message: 'aucun parc enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/encours', postEncoursSelect);

/**
 * Cette route permet de récupérer un ou plusieurs Syndics selon le type de compte, JWT necessaire.
 * @route GET /retrieve/syndic
 * @group Get_Data
 * @returns {object} 200 - {success: true, syndics: array of syndics, abonnements: array of syndics subscribed to}
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
 * Cette route permet de récupérer tous les architectes, JWT necessaire.
 * @route GET /retrieve/architecte
 * @group Get_Data
 * @returns {object} 200 - {success: true, architectes: array of architectes}
 * @returns {Error}  400 - {success: false, message: "erreur system", err: {error system log from mongoose}}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - si aucun architecte trouvé  {success: false, message: 'aucun architecte enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.get('/architecte', getArchitectes);

/**
 * Cette route permet de récupérer un architecte via son _id, JWT necessaire.
 * @route POST /retrieve/architecte
 * @group Get_Data
 * @param {ARCHITECTE.model} _id.body.required - _id
 * @returns {object} 200 - {success: true, architecte: objet architecte}
 * @returns {Error}  400 - {success: false, message: "erreur system", err: {error system log from mongoose}}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "cet Architecte n'existe pas!"}
 * @returns {Error}  404 - si aucun architecte trouvé  {success: false, message: 'aucun architecte enregistré'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/architecte', postArchitecte);

/**
 * Cette route permet de récupérer tout ou partie des gestionnaires selon le type de compte, JWT necessaire.
 * @route GET /retrieve/gestionnaire
 * @group Get_Data
 * @returns {object} 200 - {success: true, gestionnaires: array of gestionnaires}
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
 * Cette route permet de récupérer la liste entière des Visites, JWT necessaire.
 * @route GET /retrieve/visite-all
 * @group Get_Data
 * @returns {object} 200 - {success: true, visites: array of visites}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin ou architecte  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucune visite trouvée  {success: false, message: 'aucune visite enregistrée'}
 * @produces application/json
 * @security JWT
 */
router.get('/visite-all', getVisitesAll);

/**
 * Cette route permet de récupérer la liste des Visites non attribuées, JWT necessaire.
 * @route GET /retrieve/visite-unassigned
 * @group Get_Data
 * @returns {object} 200 - {success: true, visites: array of visites}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucune visite trouvée  {success: false, message: 'aucune visite enregistrée'}
 * @produces application/json
 * @security JWT
 */
router.get('/visite-unassigned', getVisitesUnassigned);

/**
 * Cette route permet de récupérer la liste des visite via _id architecte, JWT necessaire.
 * @route POST /retrieve/visite-archi
 * @group Get_Data
 * @param {VISITE.model} _id.body.required - _id de l'architecte
 * @returns {object} 200 - {success: true, visites: array of visites}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucune visite trouvée  {success: false, message: 'aucune visite enregistrée'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/visite-archi', getVisitesArchi);

/**
 * Cette route permet de récupérer une visite via son _id, JWT necessaire.
 * @route POST /retrieve/visite-one
 * @group Get_Data
 * @param {VISITE.model} _id.body.required - _id de l'architecte
 * @returns {object} 200 - {success: true, visites: array of visites}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== architecte ou admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si le compte n'est pas enregistré {success: false, message: "ce compte n'existe pas!"}
 * @returns {Error}  404 - si aucune visite trouvée  {success: false, message: 'aucune visite enregistrée'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/visite-one', getOneVisite);

/**
 * Cette route permet de récupérer un Incidents via son _id, JWT necessaire.
 * @route POST /retrieve/incident
 * @group Get_Data
 * @param {INCIDENT.model} _id.body.required - _id de l'incident
 * @param {INCIDENT.model} coproId.body.required - _id de la copro
 * @param {INCIDENT.model} architecteId.body - _id de l'architecte
 * @param {INCIDENT.model} syndicId.body - _id du Syndic
 * @param {INCIDENT.model} gestionnaireId.body - _id du gestionnaire
 * @param {INCIDENT.model} courtierId.body - _id du courtier
 * @returns {object} 200 - {success: true, incident: objet incident}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== architecte, syndic, gestionnaire, courtier, pcs ou admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - si aucun incident trouvée  {success: false, message: 'incident introuvable'}
 * @produces application/json
 * @security JWT
 */
router.post('/incident', postOneIncident);

/**
 * Cette route permet de récupérer la liste des Incidents, JWT necessaire.
 * @route POST /retrieve/incident-list
 * @group Get_Data
 * @param {INCIDENT.model} coproId.body.required - _id de la copro
 * @param {INCIDENT.model} architecteId.body - _id de l'architecte
 * @param {INCIDENT.model} syndicId.body - _id du Syndic
 * @param {INCIDENT.model} gestionnaireId.body - _id du gestionnaire
 * @param {INCIDENT.model} courtierId.body - _id du courtier
 * @returns {object} 200 - {success: true, incidents: array of incidents}
 * @returns {Error}  400 - {success: false, message: error message, err: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== architecte, syndic, gestionnaire, courtier, pcs ou admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - si aucun incident trouvée  {success: false, message: 'aucun incident enregistré'}
 * @produces application/json
 * @security JWT
 */
router.post('/incident-list', postIncidentslist);

/**
 * Cette route permet de récupérer un Prestataire via son _id, JWT necessaire.
 * @route POST /retrieve/prestataire
 * @group Get_Data
 * @param {INCIDENT.model} _id.body.required - _id du Prestataire
 * @returns {object} 200 - {success: true, prestataire: Objet}
 * @returns {Error}  400 - {succes: false, message: 'erreur système', err}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès refusé'}
 * @returns {Error}  404 - si aucun prestataire trouvé  {succes: false, message: "ce prestataire n'existe pas"}
 * @produces application/json
 * @security JWT
 */
router.post('/prestataire', postPrestataire);

/**
 * Cette route permet de récupérer la liste des Prestataires, JWT necessaire.
 * @route GET /retrieve/prestataire-list
 * @group Get_Data
 * @returns {object} 200 - {success: true, prestataires: [Objet]}
 * @returns {Error}  400 - {succes: false, message: 'erreur système', err}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - si aucun presta trouvé  {succes: false, message: 'pas de prestataires enregistrés'}
 * @produces application/json
 * @security JWT
 */
router.get('/prestataire-list', getPrestataire);

/**
 * Cette route permet de récupérer des copro lié au courtier, par syndic si dans parc ou toutes celles en étude, JWT necessaire.
 * @route POST /retrieve/prestataire
 * @group Get_Data
 * @param {INCIDENT.model} syndicId.body.required - _id du syndic
 * @param {INCIDENT.model} isParc.body.required - boolean, true == parc | false == etudes
 * @returns {object} 200 - {success: true, parc: [{}]} || {success: true, etudes: [{}]}
 * @returns {Error}  400 - {succes: false, message: 'erreur système', err}
 * @returns {Error}  401 - si dans token, role !== courtier  {success: false, message: 'accès refusé'}
 * @returns {Error}  404 - si aucun courtier trouvé  {succes: false, message: "ce prestataire n'existe pas"}
 * @produces application/json
 * @security JWT
 */
router.post('/courtier-copro', getCoproCourtierBySyndic);


module.exports = router;

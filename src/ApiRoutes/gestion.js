/************************************/
/* import modules from node_modules */
/************************************/

const express   = require('express');
const multer    = require('multer');

/************************/
/* import local modules */
/************************/

let {
    deleteCopro,
    deleteArchi,
    deleteCourt,
    deletePresta,
    deleteSyndic,
    demandeVisite,
    assignerVisite,
    desassignerVisite,
    demandePrestataire,
    demandeCourtier,
    changeStatusCopro,
    assignerCourtierToCopro,
    assignerCourtierToSyndic,
    assignerPrestataireToSyndic,
    assignerGestionnaireToCopro,
    desassignerGestionnaireToCopro,
    desassignerEtudeToCourtier,
    annulerVisite,
    sendToEtude,
    aboPrestaToSyndic,
    demandeDevis,
    uploadStatSinistres,
    updatePermissionsGest,
    openAccessPCS,
    deleteIncident,
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
router.post('/unassign-visite', desassignerVisite);

/**
 *  * Cette route permet de supprimer un incident (si c'est possible0, JWT necessaire.
 *   * @route POST /gestion/delete-incident
 *    * @group gestion
 *     * @param {INCIDENT.model} incidentId.body.required - _id de l'incident
 *      * @returns {object} 200 - {success: true, message: 'Incident supprimé avec succès'}
 *       * @returns {Error}  400 - {success: false, message: 'erreur system', err: mongoose system log error}
 *        * @returns {Error}  401 - si dans token, role !== architecte {success: false, message: 'accès interdit'}
 *         * @returns {Error}  403 - si visite existe  {success: false, message: 'Architecte introuvable'}
 *          * @returns {Error}  403 - si visite existe  {success: false, message: 'Incident introuvable'}
 *           * @returns {Error}  403 - si visite existe  {success: false, message: 'Impossible à supprimer car travaux en cours.'}
 *            * @produces application/json
 *             * @consumes application/json
 *              * @security JWT
 *               */
router.post('/delete-incident', deleteIncident);

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
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - {success: false, message: 'erreur', err: mongoose system log error}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/syndic-prestataire', assignerPrestataireToSyndic);

/**
 * Cette route permet d'assigner un Gestionnaire à une Copro, JWT necessaire.
 * @route POST /gestion/assign-gestionnaire
 * @group gestion
 * @param {string} gestionnaireId.body.required - _id du Gestionnaire
 * @param {string} coproId.body.required - _id de la Copro
 * @param {boolean} isParc.body.required - variable indiquant si Copro est dans parc si 'true', dans enCoursSelect si 'false'
 * @returns {object} 200 - {success: true, message: "La copropriété ("+copro.nomCopro+") a bien été ajouté à la liste de "+gest.firstName"}
 * @returns {Error}  400 - {success: false, message: 'erreur systeme', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== syndic  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - {success: false, message: 'ressource (copro ou Gestionnaire) introuvable'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/assign-gestionnaire', assignerGestionnaireToCopro);

/**
 * Cette route permet de désassigner un Gestionnaire d'une Copro, JWT necessaire.
 * @route POST /gestion/unassign-gestionnaire
 * @group gestion
 * @param {string} gestionnaireId.body.required - _id du Gestionnaire
 * @param {string} coproId.body.required - _id de la Copro
 * @param {boolean} isParc.body.required - variable indiquant si Copro est dans parc si 'true', dans enCoursSelect si 'false'
 * @returns {object} 200 - {success: true, message: "La copropriété ("+copro.nomCopro+") a bien été supprimé de la liste de "+gest.firstName"}
 * @returns {Error}  400 - {success: false, message: 'erreur systeme', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== syndic  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - {success: false, message: 'ressource (copro ou Gestionnaire) introuvable'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/unassign-gestionnaire', desassignerGestionnaireToCopro);


router.post('/unassign-etude-courtier', desassignerEtudeToCourtier);
/**
 * Cette route permet de supprimer un Syndic et tout ce qui le concerne, JWT necessaire.
 * @route POST /gestion/delete-syndic
 * @group gestion
 * @param {string} _id.body.required - _id du Syndic
 * @returns {object} 200 - {success: true, message: "le courtier a bien été assigné"}
 * @returns {Error}  400 - {success: false, message: 'erreur assigniation dans prestataire', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - {success: false, message: 'erreur', err: mongoose system log error}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/delete-syndic', deleteSyndic);

/**
 * Cette route permet de demander la création d'un prestataire, JWT necessaire.
 * @route POST /gestion/demande-prestataire
 * @group gestion
 * @param {object} object.body.required - informations non mises à jour
 * @returns {object} 200 - {success: true, message: "le courtier a bien été assigné"}
 * @returns {Error}  400 - {success: false, message: 'erreur assigniation dans prestataire', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - {success: false, message: 'erreur', err: mongoose system log error}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/demande-prestataire', demandePrestataire);

/**
 * Cette route permet de changer le statut d'une Copro (parc <--> en cours selection), JWT necessaire.
 * @route POST /gestion/nomination
 * @group gestion
 * @param {string} coproId.body.required - _id d'une Copro
 * @param {boolean} isParc.body.required - true = ajouter au parc, false = ajouter à en cours de sélection
 * @returns {object} 200 - {success: true, message: "changement de statut effectué"}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/nomination', changeStatusCopro);

/**
 * Cette route permet de supprimer une Copro, JWT necessaire.
 * @route POST /gestion/delete-copro
 * @group gestion
 * @param {string} _id.body.required - _id d'une Copro
 * @returns {object} 200 - {success: true, message: "copro supprimée"}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/delete-copro', deleteCopro);

/**
 * Cette route permet de supprimer une Copro, JWT necessaire.
 * @route POST /gestion/delete-copro
 * @group gestion
 * @param {string} coproId.body.required - _id d'une Copro
 * @returns {object} 200 - {success: true, message: "la visite a été annulée"}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err}
 * @returns {Error}  401 - {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - {success: false, message: 'Un architecte effectue la visite, opération suspendue'}
 * @returns {Error}  404 - {success: false, message: "cette visite n'existe pas"}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/annuler-visite', annulerVisite);

/**
 * Cette route permet d'envoyer une Copro en étude à plusieurs Courtiers, JWT necessaire.
 * @route POST /gestion/etude
 * @group gestion
 * @param {string} coproId.body.required - _id d'une Copro
 * @param {string} courtiers.body.required - _ids des Courtiers sélectionnés
 * @returns {object} 200 - {success: true, message: 'Copro envoyé en étude'}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err}
 * @returns {Error}  401 - quand role != syndic ou gestionnaire {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/etude', sendToEtude);

/**
 * Cette route permet d'abonner/désabonner un Presta à/d'un Syndic, JWT necessaire.
 * @route POST /gestion/abo-presta
 * @group gestion
 * @param {string} prestaId.body.required - _id d'un Prestataire
 * @param {string} syndicId.body.required - _id d'un Syndic
 * @param {boolean} option - true === abonner / false === désabonner
 * @returns {object} 200 - {success: true, message: 'Copro envoyé en étude'}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err}
 * @returns {Error}  401 - quand role != admin {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - {success: false, message: "ce prestataire n'existe pas"}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/abo-presta', aboPrestaToSyndic);

/**
 * Cette route permet au syndic de demander un devis à un prestataire, JWT necessaire.
 * @route POST /gestion/demande-devis
 * @group gestion
 * @param {string} prestaId.body.required - _id d'un Prestataire
 * @param {string} syndicId.body.required - _id d'un Syndic
 * @param {boolean} option - true === abonner / false === désabonner
 * @returns {object} 200 - {success: true, message: 'demande de devis envoyée'}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err}
 * @returns {Error}  401 - quand role != prestataire {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - {success: false, message: "ce devis n'existe pas"}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/demande-devis', demandeDevis);

/**
 * @typedef Copro
 * @property {file} data.required - fichier Facture au format jpg|jpeg|png|pdf
 */
/**
 * Cette route permet d'enregistrer un Avis sur Travaux par un Architecte + photos après
 * @route POST /gestion/stats-sinistres
 * @group prestataire
 * @param {Devis.model} data.body - toutes les infos sur la Pré-réception
 * @returns {object} 200 - {success: true, message : "Avis travaux enregistré"}
 * @returns {Error}  400 - {success: false, message: error system log, err}
 * @returns {Error}  401 - si dans token, role !== architecte  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */
router.post('/stats-sinistres', multer().any(), uploadStatSinistres);

/**
 * Cette route permet de mettre à jour les droits d'un Gestionnaire, JWT necessaire.
 * @route POST /gestion/changer-droits
 * @group gestion
 * @param {string} _id.body.required - _id d'un Gestionnaire
 * @param {string} permissions.body.required - tableau des permissions à assigner
 * @param {boolean} option - true === abonner / false === désabonner
 * @returns {object} 200 - {success: true, message: 'changement de droits effectué'}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err}
 * @returns {Error}  401 - quand role != syndic {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - {success: false, message: 'gestionnaire introuvable'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/changer-droits', updatePermissionsGest);

/**
 * Cette route permet d'ouvrir un accès au PCS, JWT necessaire.
 * @route POST /gestion/access-pcs
 * @group gestion
 * @param {string} coproId.body.required - _id d'une Copro
 * @param {string} nomPCS.body.required - nom du President du Conseil
 * @param {string} prenomPCS.body.required - prenom du President du Conseil
 * @param {string} emailPCS.body.required - email du President du Conseil
 * @param {string} phone.body.required - téléphone du President du Conseil
 * @returns {object} 200 - {success: true, message: 'Accès au PCS ouvert'}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err}
 * @returns {Error}  401 - quand role != syndic ou gestionnaire {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - quand il manque des éléments {success: false, message: 'veuillez renseigner tous les champs du formulaire'}
 * @returns {Error}  404 - {success: false, message: 'Copro introuvable'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/access-pcs', openAccessPCS);

/**
 * Cette route permet de supprimer un Architecte et tout ce qui le concerne, JWT necessaire.
 * @route POST /gestion/delete-archi
 * @group gestion
 * @param {string} _id.body.required - _id de l'Architecte
 * @returns {object} 200 - {success: true, message: "l'Architecte a bien été supprimé"}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/delete-archi', deleteArchi);

/**
 * Cette route permet de supprimer un Courtier et tout ce qui le concerne, JWT necessaire.
 * @route POST /gestion/delete-courtier
 * @group gestion
 * @param {string} _id.body.required - _id du Courtier
 * @returns {object} 200 - {success: true, message: "le Courtier a bien été supprimé"}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/delete-courtier', deleteCourt);

/**
 * Cette route permet de supprimer un Prestataire et tout ce qui le concerne, JWT necessaire.
 * @route POST /gestion/delete-presta
 * @group gestion
 * @param {string} _id.body.required - _id du Prestataire
 * @returns {object} 200 - {success: true, message: "le Prestataire a bien été supprimé"}
 * @returns {Error}  400 - {success: false, message: 'erreur système', err: mongoose system log error}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/delete-presta', deletePresta);

module.exports = router;


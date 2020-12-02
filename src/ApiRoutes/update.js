/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');

/************************/
/* import local modules */
/************************/

let {
    updateCopro,
    updateCredentials,
    updateGestionnaire,
    updateInfosPresta,
    updateInfosArchi
} = require('../ApiControllers/update');

let { checkEmailBeforeUpdate } = require('../Middleware/ApiHelpers');

/***************/
/* init router */
/***************/
let router = express.Router();


/**
 * @typedef COPRO
 * @property {string} _id.required - Id de la copro
 * @property {string} nomCopro.required - nom de la copro
 * @property {string} reference.required - reference interne au syndic
 * @property {string} address.required - adresse (n° et nom de rue) de la copro - eg: 12  rue de la gare
 * @property {string} codePostal.required - code postal du siege social - eg: 78000
 * @property {string} ville.required - ville de la copro - eg: Versailles
 * @property {integer} nbBatiments.required - nombre de batiments dans la copro (1 par defaut)
 * @property {string} image - path vers l'image principale de la copro
 * @property {Array.<string>} batiments - id des batiments dans cette copro
 * @property {integer} surface.required - surface totale de la copro
 * @property {integer} multiDevis - montant (en €) de travaux probable, à partir du quel, la copro demande de faire plusieurs devis
 * @property {integer} maxTravaux - montant (en €) maximum pour des travaux sans demander l'avis de la copro
 * @property {date} moisAG - Le mois où se déroule l'AG du conseil syndical de la copro
 * @property {date} dateVisite - date de la visite de l'Architecte
 * @property {string} syndicNominated - Id du syndic affilié
 * @property {date} syndicDateNom - date de la nomination du syndic
 * @property {Array.<string>} syndicEnCours - tableau des Ids de syndic en cours de selection
 * @property {string} gestionnaire - Id du gestionnaire
 * @property {string} pcs - Id du président du conseil syndical de la copro
 * @property {object} compagnie - Compagnie d'assurance {assurance: string, echance: date}
 *
 */
/**
 * @typedef COMPAGNIE
 * @property {string} assurance - nom de la compagnie d'assurance
 * @property {date} echeance - date de fin de contrat d'assurance
 */
/**
 * Cette route permet de créer une copro, JWT necessaire.
 * @route PUT /update/copro
 * @group syndic et gestionnaire
 * @param {COPRO.model} _id.body.required - Id de la Copro
 * @param {COPRO.model} nomCopro.body.required - nom de la copro
 * @param {COPRO.model} reference.body.required - reference - reference interne au syndic
 * @param {COPRO.model} address.body.required - adresse (n° et nom de rue) de la copro - eg: 12  rue de la gare
 * @param {COPRO.model} codePostal.body.required - code postal du siege social - eg: 78000
 * @param {COPRO.model} ville.body.required - ville de la copro - eg: Versailles
 * @param {COPRO.model} nbBatiments.body.required - nombre de batiments dans la copro (1 par defaut)
 * @param {COPRO.model} image.body - path vers l'image principale de la copro
 * @param {COPRO.model} batiments.body - id des batiments dans cette copro
 * @param {COPRO.model} surface.body.required - surface totale de la copro
 * @param {COPRO.model} multiDevis.body - montant (en €) de travaux probable, à partir du quel, la copro demande de faire plusieurs devis
 * @param {COPRO.model} maxTravaux.body - montant (en €) maximum pour des travaux sans demander l'avis de la copro
 * @param {COPRO.model} moisAG.body - Le mois où se déroule l'AG du conseil syndical de la copro
 * @param {COPRO.model} dateVisite.body - date de la visite de l'Architecte
 * @param {COPRO.model} syndicNominated.body - Id du syndic affilié
 * @param {COPRO.model} syndicDateNom.body - date de la nomination du syndic
 * @param {COPRO.model} syndicEnCours.body - tableau des Ids de syndic en cours de selection
 * @param {COPRO.model} gestionnaire.body - Id du gestionnaire
 * @param {COPRO.model} pcs.body - Id du président du conseil syndical de la copro
 * @param {COMPAGNIE.model} compagnie.body - date de nomination du pcs
 * @returns {object} 200 - {success: true, message : 'La Copro a bien été crée'}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic ou role !== gestionnaire ou role !== 'architecte'  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.put('/copro', updateCopro);

/**
 * Cette route permet de changer les droits d'un gestionnaire, JWT necessaire.
 * @route PUT /update/gestionnaire
 * @group syndic et gestionnaire
 * @param {string} _id.body.required - _id du Gestionnaire ciblé
 * @param {Array.<integer>} permissions.body.required - tableau d'entiers correspondant aux permissions accordées aux Gestionnaire
 */
router.put('/gestionnaire', updateGestionnaire);

/**
 * Cette route permet de changer les emails et mdp de compte, JWT necessaire.
 * @route PUT /update/credentials
 * @group auth
 * @param {string} _id.body.required - _id de l'utilisateur ciblé
 * @param {string} password.body.required - mot de passe de l'utilisateur ciblé
 */
router.put('/credentials', checkEmailBeforeUpdate, updateCredentials);

/**
 * Cette route permet de modifier les informations du prestataire, JWT necessaire.
 * @route PUT /update/prestataire-infos
 * @group prestataire
 */
router.put('/prestataire-infos', updateInfosPresta);

/**
 * Cette route permet de modifier les informations de l'architecte, JWT necessaire.
 * @route PUT /update/architecte-infos
 * @group architecte
 */
router.put('/architecte-infos', updateInfosArchi);

module.exports = router;

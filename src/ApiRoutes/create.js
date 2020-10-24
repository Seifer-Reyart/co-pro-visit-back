/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');
const multer  = require('multer');
/************************/
/* import local modules */
/************************/

let {checkEmailExist} = require('../Middleware/ApiHelpers');

let {
    registerSyndic,
    registerCourtier,
    registerArchitecte,
    registerPresidentCS,
    registerPrestataire,
    registerGestionnaire,
    registerIncident,
    parseXlsThenStore,
} = require('../ApiControllers/create');

let {
    uploadRCDecennale,
    uploadRCProfessionnelle,
    uploadBatImage,
    uploadDevisFile,
    uploadFactureFile
} = require('../ApiControllers/create');

let registerCopro       = require('../ApiControllers/create').registerCopro,
    registerBatiment    = require('../ApiControllers/create').registerBatiment;

let registerEvaluation   = require('../ApiControllers/create').registerEvaluation;

/***************/
/* init router */
/***************/
let router = express.Router();

/**
 * @typedef ADMIN
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} password.required - mot de passe - eg: t5@VuLs#Sbght8yN
 * @property {string} firstName - prenom - eg: martin
 * @property {string} lastName - nom - eg: dupont
 * @property {string} role - type de compte - eg: admin
 */

/**
 * @typedef SYNDIC
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} firstName.required - prenom utilisateur - eg: john
 * @property {string} lastName.required - nom utilisateur - eg: doe
 * @property {string} nomSyndic.required - nom/raison sociale du Syndic - eg: SOCAGI
 * @property {string} siren.required - numero siren du syndic 9 chiffres - eg: 999999999
 * @property {string} address.required - adresse (n° et nom de rue) du siege social - eg: 12  rue de la gare
 * @property {string} codePostal.required - code postal du siege social - eg: 78000
 * @property {string} ville.required - ville du siege social - eg: Versailles
 * @property {string} phone.required - numero contact syndic - eg: 0123456789
 * @property {string} image - image du compte syndic
 * @property {Array.<string>} parc - id des copros affiliées
 * @property {Array.<string>} enCoursSelect - id des copros en cours de selection
 * @property {Array.<string>} courtiers - id des courtiers affiliés
 * @property {Array.<string>} prestataires - id des prestataires affiliés
 * @property {string} role - type de compte - eg: syndic
 */
/**
 * Cette route permet de créer un Syndic, le mot de passe du compte est généré dans le Back et envoyé par email, JWT necessaire.
 * @route POST /create/syndic
 * @group syndic et gestionnaire
 * @param {SYNDIC.model} email.body.required - email
 * @param {SYNDIC.model} firstName.body.required - prenom utilisateur
 * @param {SYNDIC.model} lastName.body.required - Nom utilisateur
 * @param {SYNDIC.model} nomSyndic.body.required - Nom/raison sociale du Syndic
 * @param {SYNDIC.model} siren.body.required - N° Siren du Syndic
 * @param {SYNDIC.model} address.body.required - Adresse du Syndic (N° et nom de rue)
 * @param {SYNDIC.model} codePostal.body.required - code postal du Syndic
 * @param {SYNDIC.model} ville.body.required - ville du Syndic
 * @param {SYNDIC.model} phone.body.required - Téléphone contact du Syndic
 * @returns {object} 200 - {success: true, message : 'Le Syndic a bien été créé'}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/syndic', checkEmailExist, registerSyndic);

/**
 * @typedef GESTIONNAIRE
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} firstName.required - prenom utilisateur - eg: john
 * @property {string} lastName.required - nom utilisateur - eg: doe
 * @property {string} syndic.required - Object Id du Syndic
 * @property {string} image - Object Id du Syndic
 * @property {string} phone.required - numero contact syndic - eg: 0123456789
 * @property {Array.<string>} parc - id des copros affiliées
 * @property {Array.<string>} enCoursSelect - id des copros en cours de selection
 * @property {Array.<integer>} permissions - contient des entiers de 0 à 6 chacun correspondant à une permission spécifique
 * @property {string} role - type de compte - eg: syndic
 */
/**
 * Cette route permet de créer un Gestionnaire, le mot de passe du compte est généré dans le Back et envoyé par email, JWT necessaire.
 * @route POST /create/gestionnaire
 * @group syndic et gestionnaire
 * @param {GESTIONNAIRE.model} email.body.required - email
 * @param {GESTIONNAIRE.model} firstName.body.required - prenom utilisateur
 * @param {GESTIONNAIRE.model} lastName.body.required - Nom utilisateur
 * @param {GESTIONNAIRE.model} syndic.body.required - Object Id du Syndic
 * @param {GESTIONNAIRE.model} phone.body.required - Téléphone contact du Syndic
 * @param {GESTIONNAIRE.model} parc.body - tableau Ids des copros affiliées
 * @param {GESTIONNAIRE.model} enCourSelect.body - tableau Ids des copros en cours de selection
 * @param {GESTIONNAIRE.model} permissions.body - contient des entiers de 0 à 6 chacun correspondant à une permission spécifique
 * @returns {object} 200 - {success: true, message : 'Le Gestionnaire a bien été créé'}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== syndic  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/gestionnaire', checkEmailExist, registerGestionnaire);

/**
 * @typedef COURTIER
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} firstName.required - prenom utilisateur - eg: john
 * @property {string} lastName.required - nom utilisateur - eg: doe
 * @property {string} image - image du courtier
 * @property {string} company - nom/raison sociale du Courtier - eg: John Doe, Cabinet Dupont... etc
 * @property {string} address.required - adresse (n° et nom de rue) du siege social - eg: 1 rue d'artichot
 * @property {string} codePostal.required - code postal du siege social - eg: 75001
 * @property {string} ville.required - ville du siege social - eg: Paris
 * @property {string} phone.required - N° contact Courtier - eg: 0123456789
 * @property {Array.<string>} syndic - array contenant les Id des syndics affiliés
 * @property {string} role - type de compte - eg: courtier
 *
 */
/**
 * Cette route permet de créer un Courtier, le mot de passe du compte est généré dans le Back, JWT necessaire.
 * @route POST /create/courtier
 * @group courtier
 * @param {COURTIER.model} email.body.required - email
 * @param {COURTIER.model} firstName.body.required - prenom utilisateur
 * @param {COURTIER.model} lastName.body.required - Nom utilisateur
 * @param {COURTIER.model} company.body - Nom/raison sociale du Courtier
 * @param {COURTIER.model} address.body.required - Adresse du Courtier (N° et nom de rue)
 * @param {COURTIER.model} codePostal.body.required - code postal du Courtier
 * @param {COURTIER.model} ville.body.required - ville du Courtier
 * @param {COURTIER.model} phone.body.required - Téléphone contact du Courtier
 * @returns {object} 200 - {success: true, message : 'Le Courtier a bien été créé'}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/courtier', checkEmailExist, registerCourtier);

/**
 * @typedef ARCHITECTE
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} firstName.required - prenom utilisateur - eg: john
 * @property {string} lastName.required - nom utilisateur - eg: doe
 * @property {string} image - image de l'architecte
 * @property {string} nomCabinet.required - nom/raison sociale du cabinet d'architecte
 * @property {string} siren.required - numero siren de l'Architecte 9 chiffres - eg: 999999999
 * @property {string} address.required - adresse (n° et nom de rue) du siege social - eg: 1 rue d'artichot
 * @property {string} codePostal.required - code postal du siege social - eg: 75001
 * @property {string} ville.required - ville du siege social - eg: Paris
 * @property {string} phone.required - N° contact Architecte - eg: 0123456789
 * @property {Array.<string>} zoneInter.required - Tableau contenant les Codes Postaux où l'Architecte peut intervenir
 * @property {Array.<string>} copros - array contenant les Id des copropriétés affiliées
 * @property {string} role - type de compte - eg: architecte
 *
 */
/**
 * Cette route permet de créer un architecte, le mot de passe du compte est généré dans le Back, JWT necessaire.
 * @route POST /create/architecte
 * @group architecte
 * @param {ARCHITECTE.model} email.body.required - email
 * @param {ARCHITECTE.model} firstName.body.required - prenom utilisateur
 * @param {ARCHITECTE.model} lastName.body.required - Nom utilisateur
 * @param {ARCHITECTE.model} nomCabinet.body.required - Nom/raison sociale du cabinet d'architecte
 * @param {ARCHITECTE.model} siren.body.required - N° Siren de l'Architecte
 * @param {ARCHITECTE.model} address.body.required - Adresse du cabinet (N° et nom de rue)
 * @param {ARCHITECTE.model} codePostal.body.required - code postal du cabinet
 * @param {ARCHITECTE.model} ville.body.required - ville du cabinet
 * @param {ARCHITECTE.model} phone.body.required - Téléphone contact de l'Architecte
 * @param {ARCHITECTE.model} zoneInter.body.required - Tableau contenant les Codes Postaux où l'Architecte peut intervenir
 * @returns {object} 200 - {success: true, message : "L'ARCHITECTE a bien été créé"}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/architecte', checkEmailExist, registerArchitecte);

/**
 * @typedef PCS
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} firstName.required - prenom utilisateur - eg: john
 * @property {string} image - image du President du Conseil Syndical
 * @property {string} lastName.required - nom utilisateur - eg: doe
 * @property {string} phone.required - N° contact Architecte - eg: 0123456789
 * @property {string} coproId.required - object Id de la copro affiliée
 * @property {Array.<integer>} permissions - contient une unique valeur "0" lecture seule
 * @property {string} role - type de compte - eg: pcs
 *
 */
/**
 * Cette route permet de créer un Président du conseil syndical, le mot de passe du compte est généré dans le Back, JWT necessaire.
 * @route POST /create/pcs
 * @group pcs
 * @param {PCS.model} email.body.required - email
 * @param {PCS.model} firstName.body.required - prenom utilisateur
 * @param {PCS.model} lastName.body.required - Nom utilisateur
 * @param {PCS.model} phone.body.required - Téléphone contact de PCS
 * @param {PCS.model} coproId.body.required - Object Id de la copro affiliée
 * @returns {object} 200 - {success: true, message : "Le PCS a bien été crée"}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== 'syndic' || role !== 'gestionnaire' || role !== 'admin' {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/pcs', checkEmailExist, registerPresidentCS);

/**
 * @typedef RCDECENNALE
 * @property {file} data.required - fichier RCDecennale au format jpg|jpeg|png|pdf
 */
/**
 * Cette route permet de uploader la RCDecennale du prestataire
 * @route POST /create/rcdecennale
 * @group prestataire
 * @param {RCDECENNALE.model} data.body - fichier RCDecennale au format jpg|jpeg|png|pdf
 * @returns {object} 200 - {success: true, message : "RCDecennale uploadé!", RCDecennale: "filename"}
 * @returns {Error}  400 - {success: false, message: error system log}
 * @returns {Error}  401 - si dans token, role !== prestataire  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */
router.post('/rcdecennale', uploadRCDecennale);

/**
 * @typedef RCPROFESSIONNELLE
 * @property {file} data.required - fichier RCProfessionnelle au format jpg|jpeg|png|pdf
 */
/**
 * Cette route permet de uploader la RCProfessionnelle du prestataire
 * @route POST /create/rcprofessionnelle
 * @group prestataire
 * @param {RCPROFESSIONNELLE.model} data.body - fichier RCProfessionnelle au format jpg|jpeg|png|pdf
 * @returns {object} 200 - {success: true, message : "RCProfessionnelle uploadé!", RCProfessionnelle: "filename"}
 * @returns {Error}  400 - {success: false, message: error system log}
 * @returns {Error}  401 - si dans token, role !== prestataire  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */
router.post('/rcprofessionnelle', uploadRCProfessionnelle);

/**
 * @typedef PRESTATAIRE
 * @property {string} email.required - email du compte - eg: martin.dupont@gmail.com
 * @property {string} company.required - nom entreprise
 * @property {string} image - image du Prestataire
 * @property {string} siret.required - n° siret du syndic 14 chiffres - eg: 12341234567891
 * @property {string} address.required - adresse (n° et nom de rue) du siege social - eg: 12  rue de la gare
 * @property {string} codePostal.required - code postal du siege social - eg: 78000
 * @property {string} ville.required - ville du siege social - eg: Versailles
 * @property {string} phone.required - N° contact Prestataire - eg: 0623456789
 * @property {integer} nbSalaries - nombre de salairiés
 * @property {string} RCProfessionnelle.required - path vers le fichier RC-Professionnelle
 * @property {string} RCDecennale.required - path vers le fichier RC-Decennale
 * @property {Array.<string>} syndics - tableau Ids Syndics affiliés
 * @property {Array.<string>} corpsEtat.required - tableau types d'activités
 * @property {object} representant.required - sous objet contenant les infos du gérant de l'entreprise
 * @property {string} role - type de compte - eg: prestataire
 *
 */
/**
 * @typedef REPRESENTANT
 * @property {string} firstName.required - prenom du representant
 * @property {string} lastName.required - nom du representant
 * @property {string} phone.required - Téléphone du représentant
 * @property {string} email.required - Email du représentant
 */
/**
 * Cette route permet de créer un Prestataire, le mot de passe du compte est généré dans le Back, JWT necessaire.
 * @route POST /create/prestataire
 * @group prestataire
 * @param {PRESTATAIRE.model} email.body.required - email
 * @param {PRESTATAIRE.model} company.body.required - nom entreprise
 * @param {PRESTATAIRE.model} siret.body.required - N° Siret 14 chiffres - eg: 12341234567891
 * @param {PRESTATAIRE.model} address.body.required - Adresse de l'entreprise (N° et nom de rue)
 * @param {PRESTATAIRE.model} codePostal.body.required - code postal de l'enreprise
 * @param {PRESTATAIRE.model} ville.body.required - ville de l'entreprise
 * @param {PRESTATAIRE.model} phone.body.required - Téléphone contact prestataire
 * @param {PRESTATAIRE.model} nbSalaries.body - nombre de salariés dans l'entreprise
 * @param {PRESTATAIRE.model} RCProfessionnelle.body.required - path vers le fichier RC-Professionnelle
 * @param {PRESTATAIRE.model} RCDecennale.body.required - path vers le fichier RC-Decennale
 * @param {PRESTATAIRE.model} syndics.body - tableau Ids Syndics affiliés
 * @param {PRESTATAIRE.model} corpsEtat.body.required - tableau types d'activités
 * @param {REPRESENTANT.model} representant.body.required - sous objet contenant les infos du gérant de l'entreprise {firstName: string, lastName: string, phone: string, email: string}
 * @returns {object} 200 - {success: true, message : "Le Prestataire a bien été créé"}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/prestataire', checkEmailExist, registerPrestataire);

/**
 * @typedef COPRO
 * @property {string} nomCopro.required - nom de la copro
 * @property {string} reference.required - reference interne au syndic
 * @property {string} address.required - adresse (n° et nom de rue) de la copro - eg: 12  rue de la gare
 * @property {string} codePostal.required - code postal du siege social - eg: 78000
 * @property {string} ville.required - ville de la copro - eg: Versailles
 * @property {integer} nbBatiments.required - nombre de batiments dans la copro (1 par defaut)
 * @property {string} image - path vers l'image principale de la copro
 * @property {Array.<string>} batiments - id des batiments dans cette copro
 * @property {integer} surface.required - surface totale de la copro
 * @property {integer} nbrLot.required - nombre de lot
 * @property {integer} multiDevis - montant (en €) de travaux probable, à partir du quel, la copro demande de faire plusieurs devis
 * @property {integer} maxTravaux - montant (en €) maximum pour des travaux sans demander l'avis de la copro
 * @property {date} moisAG - Le mois où se déroule l'AG du conseil syndical de la copro
 * @property {date} dateVisite - date de la visite de l'Architecte
 * @property {string} syndicNominated - Id du syndic affilié
 * @property {date} syndicDateNom - date de la nomination du syndic
 * @property {Array.<string>} syndicEnCours - tableau des Ids de syndic en cours de selection
 * @property {string} gestionnaire - Id du gestionnaire
 * @property {string} pcs - Id du président du conseil syndical de la copro
 * @property {object} compagnie - Compagnie d'assurance {assurance: string, echeance: date}
 *
 */
/**
 * @typedef COMPAGNIE
 * @property {string} assurance - nom de la compagnie d'assurance
 * @property {date} echeance - date de fin de contrat d'assurance
 */
/**
 * Cette route permet de créer une copro, JWT necessaire.
 * @route POST /create/copro
 * @group syndic et gestionnaire
 * @param {COPRO.model} nomCopro.body.required - nom de la copro
 * @param {COPRO.model} reference.body.required - reference - reference interne au syndic
 * @param {COPRO.model} address.body.required - adresse (n° et nom de rue) de la copro - eg: 12  rue de la gare
 * @param {COPRO.model} codePostal.body.required - code postal du siege social - eg: 78000
 * @param {COPRO.model} ville.body.required - ville de la copro - eg: Versailles
 * @param {COPRO.model} nbBatiments.body.required - nombre de batiments dans la copro (1 par defaut)
 * @param {COPRO.model} imgCopro.body - path vers l'image principale de la copro
 * @param {COPRO.model} batiments.body - id des batiments dans cette copro
 * @param {COPRO.model} surface.body.required - surface totale de la copro
 * @param {COPRO.model} nbrLot.body.required - nombre de lot
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
 * @returns {Error}  401 - si dans token, role !== 'syndic' || role !== 'gestionnaire'  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/copro', registerCopro);

/**
 * @typedef COPROS-FROM-XLS
 * @property {file} data.required - fichier Excel pour enregistrer plusieurs Copros d'un coup
 */
/**
 * Cette route permet de uploader un fichier Excel dans le but d'enregistrer plusieurs copros en même temps
 * @route POST /create/multi-copros
 * @group syndic et gestionnaire
 * @param {COPROS-FROM-XLS.model} data.body - fichier Excel pour enregistrer plusieurs Copros d'un coup
 * @returns {object} 200 - {success: true, message : "La liste de Copros a bien été créée"}
 * @returns {Error}  400 - {success: false, message: "message d'erreur si mauvais format de fichier (xls|xlsx)"}
 * @returns {Error}  401 - si dans token, role !== 'syndic' || role !== 'gestionnaire'  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */

router.post('/multi-copros', parseXlsThenStore);

/**
 * @typedef BATIMENT
 * @property {string} reference.required - reference - reference interne à la copro - eg: bat1, batA, batiment bleu... etc
 * @property {integer} surface.required - surface totale de du batiment
 * @property {string} coproId.required - Id de la copro
 * @property {string} natureConstruction - type de construction
 * @property {string} precisezConstr - Précisez la nature de la construction
 * @property {string} etatFacadeCanal - etat façade et canalisation - eq: bon, mauvais... etc
 * @property {integer} nbEtages - nombre d'étage dans le batiment
 * @property {object} facadeRue - spécificités de la façade coté rue
 * @property {object} facadeArriere - spécificités de la façade arrière
 * @property {Array.<object>} entrees - tableau des entrées du batiment
 * @property {boolean} planEvacHall - présence d'un plan d'évacuation dans le hall
 * @property {boolean} cmdDesenfumage - présence d'une commande de désenfumage
 * @property {boolean} alarmeIncendie - présence d'un boitier d'alarme incendie
 * @property {boolean} Ascenceur - présence d'un Ascenceur
 * @property {string} etatAscenceur - etat global des portes et cabine de l'ascenceur - eg: bon, mauvais... etc
 * @property {object} escalier - spécificités global de l'escalier principal
 * @property {boolean} cleCabinet - présence des clés dans la loge du gardien
 * @property {object} occupation - specificité sur les occupants du batiment
 * @property {object} cave - spécificité des caves
 * @property {object} parkingST - spécificités du parking sous terrain si existe
 * @property {object} chaufferie - spécificités de la chaufferie
 * @property {object} image - sous objet contenant des tableaux d'images pour certaines parties du batiment
 */
/**
 * @typedef FACADERUE
 * @property {string} etatGen - etat général de la façade - eg: bon, mauvais... etc
 * @property {boolean} commerces - présence de commerces
 * @property {string} natCommerce - type de commerces si il y en a
 */
/**
 * @typedef FACADEARRIERE
 * @property {boolean} access - y a t-il un accès par la façade arrière
 * @property {string} etatGen - etat général de la façade - eg: bon, mauvais... etc
 */
/**
 * @typedef ENTREES
 * @property {string} refEntree - nom ou n° de l'entrée
 * @property {string} specEntree - porte d'entrée avec ...
 * @property {string} codeAccess - code d'accès de la porte
 * @property {boolean} codeAccess2 - présence ou nom d'un deuxieme code d'accès - eg: dans le cas d'un sas dans le hall
 * @property {string} specCodeAccess2 - type du 2eme code d'accès avec le code, le cas échéant
 * @property {boolean} cameraVideo - présence de visio camera
 */
/**
 * @typedef ESCALIER
 * @property {string} natureMarches - nature des marches
 * @property {string} naturePaliers - nature des paliers
 * @property {string} etatGenMurs - etat général des murs de l'escalier - eg: bon, mauvais... etc
 * @property {string} etatGenPlafonds - etat général du plafond de l'escalier - eg: bon, mauvais... etc
 * @property {string} etatGenEscaliers - etat global de l'escalier - eg: bon, mauvais... etc
 * @property {boolean} extincteurs - présence d'extincteurs
 * @property {boolean} visite12mois - y a t-il eu viste dans les 12 derniers mois?
 */
/**
 * @typedef OCCUPATION
 * @property {boolean} habitation - exlusivement particuliers?
 * @property {boolean} bureaux - exlusivement bureaux?
 * @property {boolean} habPro - Majorité de particulier et moins de 25% de bureaux
 * @property {string} occupant - descriptif détaillé des occupants
 * @property {integer} nbNiveaux - nombre de niveaux
 */
/**
 * @typedef CAVE
 * @property {boolean} presence - présence de caves
 * @property {boolean} accessible - cave accécibles?
 * @property {string} encombrement - degré d'encombrement des caves - eg: bon, mauvais... etc
 * @property {integer} nbSousSol - nombre de sous sol de cave
 * @property {boolean} extincteurs - présence d'extincteurs
 * @property {boolean} visite12mois - y a t-il eu viste dans les 12 derniers mois?
 */
/**
 * @typedef PARKINGST
 * @property {boolean} presence - présence de parking sous terrain
 * @property {integer} nbNiveaux - nombre de niveaux
 * @property {boolean} visite12mois - y a t-il eu viste dans les 12 derniers mois?
 * @property {boolean} controlAccess - présence d'un control d'accès
 * @property {string} etatPorte - état général des portes du parking - eg: bon, mauvais... etc
 * @property {boolean} planEvac - présence d'un plan d'évacuation
 */
/**
 * @typedef CHAUFFERIE
 * @property {boolean} collective - si chauffage collectif
 * @property {boolean} individuelle - si chauffage individuel
 * @property {enum} genre - type de chauffage - eg: Fuel, Gaz, Cpu, Electrique
 * @property {boolean} visite12mois - y a t-il eu viste dans les 12 derniers mois?
 * @property {date} dateLastVisite - date de la dernière visite
 * @property {boolean} exitincteursExt - présence d'extincteurs à l'extérieur
 * @property {boolean} exitincteursInt - présence d'extincteurs à l'intérieur
 * @property {boolean} Access - accès à la chaufferie possible ?
 */
/**
 * @typedef IMAGE
 * @property {string} ParcelleCadastrale - Image de la parcelle cadastrale
 * @property {string} VueGenGoogle - Image de la vue générale Google (maps ?)
 * @property {Array.<string>} facadeRue - tableau des images façade rue
 * @property {Array.<string>} facadeArriere - tableau des images façade arrière
 * @property {Array.<string>} entrees - tableau des images des entrées
 * @property {Array.<string>} etages - tableau des images des étages
 * @property {Array.<string>} caves - tableau des images des caves
 * @property {Array.<string>} parking - tableau des images du parking
 * @property {Array.<string>} environnement - tableau des images de l'environnement
 * @property {Array.<string>} contiguite - tableau des images si contiguité
 */
/**
 * Cette route permet de créer un ou plusieurs batiment dans une copro, un tableau de batiments est attendu dans le body, JWT necessaire.
 * @route POST /create/batiment
 * @group architecte
 * @param {BATIMENT.model} reference.body.required - reference - reference interne à la copro - eg: bat1, batA, batiment bleu... etc
 * @param {BATIMENT.model} surface.body.required - surface totale de du batiment
 * @param {BATIMENT.model} coproId.body.required - Id de la copro
 * @param {IMAGE.model} image.body - Objet contenant toutes les noms des images telles qu'enregistrées sur le serveur, information précédemment renvoyées par la route /create/batImage
 * @param {BATIMENT.model} natureConstruction.body - type de construction
 * @param {BATIMENT.model} precisezConstr.body - Précisez la nature de la construction
 * @param {BATIMENT.model} facadeEtCanalisations.body - etat façade et canalisation - eq: bon, mauvais... etc
 * @param {BATIMENT.model} nbEtages.body - nombre d'étage dans le batiment
 * @param {BATIMENT.model} facadeRue.body - spécificités de la façade coté rue
 * @param {BATIMENT.model} facadeArriere.body - spécificités de la façade arrière
 * @param {ENTREES.model} entrees.body - tableau des entrées du batiment
 * @param {ESCALIER.model} escalier.body - spécifictés de l'escalier principal
 * @param {BATIMENT.model} cleCabinet.body - présence des clés dans la loge du gardien
 * @param {OCCUPATION.model} occupation.body - specificité sur les occupants du batiment
 * @param {CAVE.model} cave.body - spécificité des caves
 * @param {PARKINGST.model} parkingST.body - spécificités du parking sous terrain si existe
 * @param {CHAUFFERIE.model} chaufferie.body - spécificités de la chaufferie
 * @param {BATIMENT.model} coproId.body - _id de la copro
 * @returns {object} 200 - {success: true, message : 'Le batiment a bien été crée'}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== 'architecte' {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'Le batiment existe déjà'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/batiment', registerBatiment);

/**
 * @typedef DEVIS
 * @property {string} reference.required - reference interne au prestataire
 * @property {string} descriptif.required - bref descriptif de l'intervention
 * @property {Array.<string>} naturetravaux.required - tableau contenant les types de travaux - eg: peinture, maçonnerie... etc
 * @property {string} support - type de support - eg: beton
 * @property {string} hauteur - hauteur de plafon
 * @property {string} couleur - la couleur à utiliser
 * @property {integer} evaluationTTC.required - montant du devis
 * @property {string} coproId.required - Id de la copro
 * @property {string} batimentId - Id du batiment le cas échéant
 * @property {string} prestataireId - Id du prestataire
 * @property {string} syndicId - Id du Syndic
 * @property {string} gestionnaireId - Id du Gestionnaire
 * @property {string} pcsId - Id du président du conseil syndical
 * @property {Array.<string>} photos - photos divers pour le devis
 */
/**
 * Cette route permet de créer un devis, JWT necessaire.
 * @route POST /create/devis
 * @group prestataire
 * @param {DEVIS.model} reference.body.required - reference interne au prestataire
 * @param {DEVIS.model} descriptif.body.required - bref descriptif de l'intervention
 * @param {DEVIS.model} naturetravaux.body.required - tableau contenant les types de travaux - eg: peinture, maçonnerie... etc
 * @param {DEVIS.model} support.body - type de support - eg: beton
 * @param {DEVIS.model} hauteur.body - hauteur de plafon
 * @param {DEVIS.model} couleur.body - la couleur à utiliser
 * @param {DEVIS.model} evaluationTTC.body.required - montant du devis
 * @param {DEVIS.model} coproId.body.required - Id de la copro
 * @param {DEVIS.model} batimentId.body - Id du batiment le cas échéant
 * @param {DEVIS.model} prestataireId.body - Id du prestataire
 * @param {DEVIS.model} syndicId.body - Id du Syndic
 * @param {DEVIS.model} gestionnaireId.body - Id du Gestionnaire
 * @param {DEVIS.model} pcsId.body - Id du président du conseil syndical
 * @param {DEVIS.model} photos.body - photos divers pour le devis
 * @returns {object} 200 - {success: true, message : "Le PCS a bien été crée"}
 * @returns {Error}  400 - {success: false, message: error system log from mongoose}
 * @returns {Error}  401 - si dans token, role !== prestataire  {success: false, message: 'accès interdit'}
 * @returns {Error}  403 - si email existe  {success: false, message: 'email déjà utilisé'}
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
router.post('/evaluation', registerEvaluation);

/**
 * @typedef INCIDENT
 * @property {string} _id - _id de l'incident
 * @property {date} date - Date du constat de l'incident
 * @property {string} metrages.required - surface à étudier
 * @property {string} desordre.required - descriptif du désordre
 * @property {string} situation.required - ???
 * @property {string} description.required - Description de l'incident
 * @property {string} corpsEtat.required - corps de métier associé au désordre
 * @property {string} visiteId.required - _id de la visite
 * @property {string} coproId.required - _id de la visite
 * @property {string} syndicId.required - _id du Syndic
 * @property {string} gestionnaireId - _id du Gestionnaire
 * @property {string} architecteId - _id de l'Architecte
 * @property {string} courtierId - _id du Courtier
 * @property {string} commentaire - commentaire de l'architecte
 * @property {Array.<string>} images - Fichiers à uploader , format acceptés: jpeg|jpg|png|pdf|JPEG|JPG|PNG|PDF
 */
/**
 * Cette route permet de créer un incident, JWT necessaire, multipart/form-data.
 * @route POST /create/incident
 * @group architecte
 * @param {string}  coproId.body.required - _id de la copro
 * @param {integer} metrages.body.required - surface à étudier
 * @param {string}  desordre.body.required - descriptif du désordre
 * @param {string}  situation.body.reqired - ??
 * @param {string}  description.body.required - Description de l'incident
 * @param {string}  corpsEtat.body.required - corps de métier associé au désordre
 * @param {string}  commentaire.body - commentaire de l'architecte
 * @param {Array.<string>} images.body.required - Tableau contenant des photographies de l'incident
 * @returns {object} 200 - {success: true, message : "L'incident a bien été créé !", imagesUploadErrors: [{ imageTitle: "incident1", err: "Mauvais format, reçu text/plain, attends: /jpeg|jpg|pdf|JPEG|JPG|PNG|PDF/" }, { imageTitle: "incident2.png", err: "Erreur renvoyée par le système lors de la sauvegarde de l'image sur le serveur(il n'y aura pas marqué ca mais l'erreur en question a la place)" }}]
 * @returns {Error}  400 - {success: false, message: 'Erreur système', err}
 * @returns {Error}  401 - si dans token, role !== architecte  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - Pas de copropriété associée {success: false, message: 'copropriété non identifée"}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */

router.post('/incident', multer().any(), registerIncident);

/**
 * @typedef BATIMAGE
 * @property {string} coproId.required - _id de la copropriété
 * @property {string} image.required - image à uploader , format acceptés: jpeg|jpg|png|JPEG|JPG|PNG|
 */
/**
 * Cette route permet un upload individuel d'image lors de la visite, au moment où l'utilisateur les sélectionne, JWT necessaire, multipart/form-data. Renvoie le nom de l'image sauvegardée sur le serveur (à conserver pour formatter la requête de création des batiments).
 * @route POST /create/batImage
 * @group architecte
 * @param {string}  coproId.body.required - _id de la copro
 * @param {string} image.required - image à uploader , format acceptés: jpeg|jpg|png|JPEG|JPG|PNG|
 * @returns {object} 200 - {success: true, image: '1a34231432b.jpg'}
 * @returns {Error}  400 - {success: false, message: 'Erreur système', err}
 * @returns {Error}  401 - si dans token, role !== architecte ou admin  {success: false, message: 'accès interdit'}
 * @returns {Error}  404 - Pas de copropriété associée {success: false, message: 'Pas de copropriété associée'}
 * @returns {Error}  424 - L'upload a échoué {success: false, imageUploadError: imageUploadError}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */

router.post('/batImage', multer().fields([{name: 'image'}]), uploadBatImage);

/**
 * @typedef Devis
 * @property {file} data.required - fichier Devis au format jpg|jpeg|png|pdf
 */
/**
 * Cette route permet de uploader un Devis
 * @route POST /create/rcdecennale
 * @group prestataire
 * @param {Devis.model} data.body - fichier RCDecennale au format jpg|jpeg|png|pdf
 * @returns {object} 200 - {success: true, message : "devis uploadé!", RCDecennale: "filename"}
 * @returns {Error}  400 - {success: false, message: error system log}
 * @returns {Error}  401 - si dans token, role !== prestataire  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */
router.post('/devis-pdf', uploadDevisFile);

/**
 * @typedef Devis
 * @property {file} data.required - fichier Facture au format jpg|jpeg|png|pdf
 */
/**
 * Cette route permet de uploader une Facture
 * @route POST /create/rcdecennale
 * @group prestataire
 * @param {Devis.model} data.body - fichier RCDecennale au format jpg|jpeg|png|pdf
 * @returns {object} 200 - {success: true, message : "devis uploadé!", RCDecennale: "filename"}
 * @returns {Error}  400 - {success: false, message: error system log}
 * @returns {Error}  401 - si dans token, role !== prestataire  {success: false, message: 'accès interdit'}
 * @produces application/json
 * @consumes multipart/form-data
 * @security JWT
 */
router.post('/facture-pdf', uploadFactureFile);

module.exports = router;

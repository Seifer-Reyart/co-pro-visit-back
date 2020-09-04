/************************************/
/* import modules from node_modules */
/************************************/

let bcrypt  = require('bcryptjs');
let jwt     = require('jsonwebtoken');

/************************/
/* import local modules */
/************************/

const   secretExpr      = require('../Config/tsconfig.json');

/************************/
/* import Mongo Schemes */
/************************/

const   Devis           = require('../MongoSchemes/devis'),
        Admin           = require('../MongoSchemes/admins'),
        Copro           = require('../MongoSchemes/copros'),
        Syndic          = require('../MongoSchemes/syndics'),
        Visite          = require('../MongoSchemes/visites'),
        Courtier        = require('../MongoSchemes/courtiers'),
        Architecte      = require('../MongoSchemes/architectes'),
        PresidentCS     = require('../MongoSchemes/presidentCS'),
        Prestataire     = require('../MongoSchemes/prestataires'),
        Gestionnaire    = require('../MongoSchemes/gestionnaires');

/************/
/* Function */
/************/

/*** get Syndics ***/

/*
    METHOD: GET
*/


let getSyndics = (req, res) => {
    if (req.user.role === 'admin')
        Syndic.find({}, (err, syndics) => {
                if (err)
                    res.status(400).send({success: false, message: 'erreur system', err});
                else if (!syndics)
                    res.status(404).send({success: false, message: 'aucun syndic enregistré'});
                else
                    res.status(200).send({success: true, syndics});
            });
    else if (req.user.role === 'courtier')
        Courtier.findOne({_id: req.user.id}, (err, courtier) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!courtier)
                res.status(403).send({success: false, message: "ce courtier n'existe pas!"});
            else
                Syndic.find({_id: {$in: courtier.syndics}}, (err, syndics) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!syndics)
                        res.status(404).send({success: false, message: 'aucun syndic enregistré'});
                    else
                        res.status(200).send({success: true, syndics});
                });
        });
    else if (req.user.role === 'prestataire')
        Prestataire.findOne({_id: req.user.id}, (err, prestataire) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!prestataire)
                res.status(403).send({success: false, message: "ce prestataire n'existe pas!"});
            else
                Syndic.find({_id: {$in: prestataire.syndics}}, (err, syndics) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!syndics)
                        res.status(404).send({success: false, message: 'aucun syndic enregistré'});
                    else
                        res.status(200).send({success: true, syndics});
                });
        });
    else
        res.status(401).send({success: false, message: 'accès refusé'});
}

/*** get one Syndic ***/

let postSyndic = (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'courtier' && req.user.role !== 'prestataire' && req.user.role !== 'architecte')
        res.status(401).send({success: false, message: "accès interdit"})
    else
        Syndic.findOne({_id: req.body._id})
            .populate({
                path: 'parc',
                model: 'copros'
            })
            .populate({
                path: 'gestionnaires',
                model: 'gestionnaires'
            })
            .then((syndic, err) => {
                if (err)
                    res.status(400).send({success: false, message: 'erreur system', err});
                else if (!syndic)
                    res.status(404).send({success: false, message: "ce syndic n'existe pas"});
                else
                    res.status(200).send({success: true, syndic});
            });
}

/*** get Gestionnaires ***/

let getGestionnaires = (req, res) => {
    if (req.user.role === 'syndic')
        Gestionnaire.find({syndic: req.user.id}, (err, gestionnaires) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!gestionnaires)
                res.status(404).send({success: false, message: 'aucun gestionnaire enregistré'});
            else
                res.status(200).send({success: true, gestionnaires});
        })
    else
        res.status(401).send({success: false, message: 'accès refusé'});
}

/*** get one gestionnaire ***/

let postGestionnaire = (req, res) => {
    if (req.user.role === 'syndic' || req.user.role === 'admin')
        Gestionnaire.find({syndic: req.body._id}, (err, gestionnaire) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!gestionnaire)
                res.status(404).send({success: false, message: 'aucun gestionnaire enregistré'});
            else
                res.status(200).send({success: true, gestionnaire});
        })
    else
        res.status(401).send({success: false, message: 'accès refusé'});
}

/*** get Courtiers ***/

let getCourtiers = (req, res) => {
    if (req.user.role === 'admin')
        Courtier.find({}, (err, courtiers) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!courtiers)
                res.status(404).send({success: false, message: 'aucun courtier enregistré'});
            else
                res.status(200).send({success: true, courtiers});
        });
    else if (req.user.role === 'syndic')
        Syndic.findOne({_id: req.user.id}, (err, syndic) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!syndic)
                res.status(403).send({success: false, message: "ce Syndic n'existe pas!"});
            else
                Courtier.find({_id: {$in: syndic.courtiers }}, (err, courtiers) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!courtiers)
                        res.status(404).send({success: false, message: 'aucun courtier enregistré'});
                    else
                        res.status(200).send({success: true, courtiers});
                });
        })
    else if (req.user.role === 'gestionnaire')
        Gestionnaire.findOne({_id: req.user.id}, (err, gestionnaire) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!gestionnaire)
                res.status(403).send({success: false, message: "ce Gestionnaire n'existe pas!"});
            else
                Syndic.findOne({_id: gestionnaire.syndic}, (err, syndic) => {
                    Courtier.find({_id: {$in: syndic.courtiers }}, (err, courtiers) => {
                        if (err)
                            res.status(400).send({success: false, message: 'erreur system', err});
                        else if (!courtiers)
                            res.status(404).send({success: false, message: 'aucun courtier enregistré'});
                        else
                            res.status(200).send({success: true, courtiers});
                    });
                })
        })
    else
        res.status(401).send({success: false, message: 'accès refusé'});
}

/*** get one courtier ***/

let postCourtier = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire' && req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès refusé'});
    else
        Courtier.findOne({_id: req.body._id}, (err, courtier) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!courtier)
                res.status(404).send({success: false, message: 'aucun courtier enregistré'});
            else
                res.status(200).send({success: true, courtier});
        })
}

/*** get devis ***/

let getDevis = (req, res) => {
    Devis.find({}, (err, devis) => {
        if (err)
            res.status(400).send({success: false, message: 'erreur system', err});
        else if (!devis)
            res.status(404).send({success: false, message: 'aucun devis enregistré'});
        else
            res.status(200).send({success: true, devis});
    })
}

/*** get parc Copro ***/

let getCopro = (req, res) => {
    if (req.user.role === 'syndic')
        Syndic.findOne({_id: req.user.id}, (err, syndic) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!syndic)
                res.status(404).send({success: false, message: 'aucun syndic enregistré'});
            else
                Copro.find({_id: {$in: syndic.parc}}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucun parc enregistré'});
                    else
                        res.status(200).send({success: true, parc: copros});
                })
        });
    else if (req.user.role === 'gestionnaire')
        Gestionnaire.findOne({_id: req.user.id}, (err, gestionnaire) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!gestionnaire)
                res.status(404).send({success: false, message: 'aucun gestionnaire enregistré'});
            else
                Copro.find({_id: {$in: gestionnaire.parc}}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucun parc enregistré'});
                    else
                        res.status(200).send({success: true, parc: copros});
                })
        });
    else if (req.user.role === 'courtier')
        Courtier.findOne({_id: req.user.id}, (err, courtier) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!courtier)
                res.status(404).send({success: false, message: 'aucun courtier enregistré'});
            else
                Copro.find({_id: {$in: courtier.parc}}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucun parc enregistré'});
                    else
                        res.status(200).send({success: true, parc: copros});
                })
        });
    else if (req.user.role === 'pcs')
        PresidentCS.findOne({_id: req.user.id}, (err, pcs) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!pcs)
                res.status(404).send({success: false, message: 'aucun pcs enregistré'});
            else
                Copro.find({_id: pcs.coproId}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucun parc enregistré'});
                    else
                        res.status(200).send({success: true, parc: copros});
                })
        });
    else
        res.status(401).send({success: false, message: 'accès refusé'});
}

/*** get Copros en cours de selection ***/

let getEncoursSelect = (req, res) => {
    if (req.user.role === 'syndic')
        Syndic.findOne({_id: req.user.id}, (err, syndic) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!syndic)
                res.status(404).send({success: false, message: 'aucun syndic enregistré'});
            else
                Copro.find({_id: {$in: syndic.enCoursSelect}}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucune copro en cours de selection'});
                    else
                        res.status(200).send({success: true, enCours: copros});
                })
        });
    else if (req.user.role === 'gestionnaire')
        Gestionnaire.findOne({_id: req.user.id}, (err, gestionnaire) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!gestionnaire)
                res.status(404).send({success: false, message: 'aucun gestionnaire enregistré'});
            else
                Copro.find({_id: {$in: gestionnaire.enCoursSelect}}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucune copro en cours de selection'});
                    else
                        res.status(200).send({success: true, enCours: copros});
                })
        });
    else
        res.status(401).send({success: false, message: 'accès refusé'});
}

/*** get one copro ***/

let postCopro = (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'syndic' && req.user.role !== 'gestionnaire' && req.user.role !== 'pcs' && req.user.role !== 'courtier' && req.user.role !== 'architecte' && req.user.role !== 'prestataire')
        res.status(401).send({success: false, message: 'accès refusé'});
    else
        Copro.findOne({_id: req.body._id})
            .populate({
                path: 'batiments',
                model: 'batiments'
            })
            .populate({
                path: 'syndicNominated',
                model: 'syndics'
            })
            .populate({
                path: 'gestionnaire',
                model: 'gestionnaires'
            })
            .then((copro, err) => {
                if (err)
                    res.status(400).send({success: false, message: 'erreur system', err});
                else if (!copro)
                    res.status(404).send({success: false, message: 'aucune copro enregistrée'});
                else
                    res.status(200).send({success: true, copro: copro});
            })
}


/*** get Visites list ***/

let getVisites = (req, res) => {
    if (req.user.role === 'admin')
        Admin.findOne({_id: req.user.id}, (err, admin) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!admin)
                res.status(403).send({success: false, message: 'aucun admin enregistré'});
            else
                Visite.find({}, (err, visites) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!visites)
                        res.status(403).send({success: false, message: 'aucune visite enregistrée'});
                    else
                        res.status(200).send({success: true, visites});
                })
        })
    else if (req.user.role === 'architecte')
        Architecte.findOne({_id: req.user.id}, (err, architecte) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!architecte)
                res.status(404).send({success: false, message: 'aucun architecte enregistré'});
            else
                Visite.find({}, (err, visites) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!visites)
                        res.status(404).send({success: false, message: 'aucune visite enregistrée'});
                    else
                        res.status(200).send({success: true, visites});
                })
        })
    else
        res.status(401).send({success: false, message: 'accès refusé'});
}

/*** get one Visite ***/

let postVisite = (req,res) => {
    if (req.user.role !== 'architecte' && req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès refusé'});
    else
        Visite.findOne({_id: req.body._id}, function (err, visite) {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!visite)
                res.status(404).send({success: false, message: 'aucune visite enregistrée'});
            else
                res.status(200).send({success: true, visite});
        })
}

/*** get Architectes list ***/

let getArchitectes = (req,res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès refusé'});
    else
        Architecte.find({}, function (err, architectes) {
            if (err)
                res.status(400).send({success: false, message: "erreur system", err});
            else if (!architectes)
                res.status(404).send({success: false, message: "aucun architecte enregistré"});
            else
                res.status(200).send({success: true, architectes});
        });
}

/*** get one Architecte ***/

let postArchitecte = (req,res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès refusé'});
    else
        Architecte.findOne({_id: req.body._id}, function (err, architecte) {
            if (err)
                res.status(400).send({success: false, message: "erreur system", err});
            else if (!architecte)
                res.status(403).send({success: false, message: "cet architecte n'existe pas"});
            else
                res.status(200).send({success: true, architectes});
        });
}

module.exports = {
    getCopro,
    postCopro,
    getSyndics,
    postSyndic,
    getVisites,
    postVisite,
    getCourtiers,
    postCourtier,
    getArchitectes,
    postArchitecte,
    getGestionnaires,
    postGestionnaire,
    getEncoursSelect,
}

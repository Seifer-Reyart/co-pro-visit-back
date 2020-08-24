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
        Syndic.find()
            .populate({
                path: 'parc',
                model: 'copros'
            })
            .populate({
                path: 'gestionnaires',
                model: 'gestionnaires'
            })
            .then((syndics, err) => {
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
                Copro.find({coproId: pcs.coproId}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucun parc enregistré'});
                    else
                        res.status(200).send({success: true, parc: copros});
                })
        });
    else
        res.status(403).send({success: false, message: 'accès refusé'});
}

let getVisites = (req, res) => {
    if (req.user.role === 'admin')
        Admin.findOne({_id: req.user.id}, (err, admin) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!admin)
                res.status(404).send({success: false, message: 'aucun admin enregistré'});
            else
                Visite.find({}, (err, visites) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucune visites enregistré'});
                    else
                        res.status(200).send({success: true, parc: visites});
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
                    else if (!copros)
                        res.status(404).send({success: false, message: 'aucune visites enregistré'});
                    else
                        res.status(200).send({success: true, parc: visites});
                })
        })
    else
        res.status(403).send({success: false, message: 'accès refusé'});
}

module.exports = {
    getCopro,
    getSyndics,
    getCourtiers
}

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
        Copro           = require('../MongoSchemes/copros'),
        Syndic          = require('../MongoSchemes/syndics'),
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
                res.status(400).send({success: false, message: 'aucun syndic enregistré'});
            else
                res.status(200).send({success: true, syndics});
        });
    else if (req.user.role === 'courtier')
        Courtier.findOne({_id: req.user.id}, (err, courtier) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!courtier)
                res.status(400).send({success: false, message: "ce courtier n'existe pas!"});
            else
                Syndic.find({_id: {$in: courtier.syndics}}, (err, syndics) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!syndics)
                        res.status(400).send({success: false, message: 'aucun syndic enregistré'});
                    else
                        res.status(200).send({success: true, syndics});
                });
        });
    else if (req.user.role === 'prestataire')
        Prestataire.findOne({_id: req.user.id}, (err, prestataire) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!courtier)
                res.status(400).send({success: false, message: "ce prestataire n'existe pas!"});
            else
                Syndic.find({_id: {$in: prestataire.syndics}}, (err, syndics) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!syndics)
                        res.status(400).send({success: false, message: 'aucun syndic enregistré'});
                    else
                        res.status(200).send({success: true, syndics});
                });
        });
    else
        res.status(403).send({success: false, message: 'accès refusé'});
}

/*** get Courtiers ***/

let getCourtiers = (req, res) => {
    if (req.user.role === 'admin')
        Courtier.find({}, (err, courtiers) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!courtiers)
                res.status(400).send({success: false, message: 'aucun courtier enregistré'});
            else
                res.status(200).send({success: true, courtiers});
        });
    else if (req.user.role === 'syndic')
        Syndic.findOne({_id: req.user.id}, (err, syndic) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!syndic)
                res.status(400).send({success: false, message: "ce Syndic n'existe pas!"});
            else
                Courtier.find({_id: {$in: syndic.courtiers }}, (err, courtiers) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!courtiers)
                        res.status(400).send({success: false, message: 'aucun courtier enregistré'});
                    else
                        res.status(200).send({success: true, courtiers});
                });
        })
    else
        res.status(403).send({success: false, message: 'accès refusé'});
}

/*** get devis ***/

let getDevis = (req, res) => {
    Devis.find({}, (err, devis) => {
        if (err)
            res.status(400).send({success: false, message: 'erreur system', err});
        else if (!devis)
            res.status(400).send({success: false, message: 'aucun devis enregistré'});
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
                res.status(400).send({success: false, message: 'aucun syndic enregistré'});
            else
                Copro.find({_id: {$in: syndic.parc}}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(400).send({success: false, message: 'aucun parc enregistré'});
                    else
                        res.status(200).send({success: true, parc: copros});
                })
        });
    else if (req.user.role === 'gestionnaire')
        Gestionnaire.findOne({_id: req.user.id}, (err, syndic) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (!syndic)
                res.status(400).send({success: false, message: 'aucun gestionnaire enregistré'});
            else
                Copro.find({_id: {$in: syndic.parc}}, (err, copros) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copros)
                        res.status(400).send({success: false, message: 'aucun parc enregistré'});
                    else
                        res.status(200).send({success: true, parc: copros});
                })
        });
    else
        res.status(403).send({success: false, message: 'accès refusé'});
}

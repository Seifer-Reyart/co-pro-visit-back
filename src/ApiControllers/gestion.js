/****************************************/
/*** import modules from node_modules ***/
/****************************************/

let bcrypt  = require('bcryptjs');
let multer  = require('multer');
let path    = require("path");

/***************/
/*** helpers ***/
/***************/

/****************************/
/*** import Mongo Schemes ***/
/****************************/

const   Syndic          = require('../MongoSchemes/syndics'),
        Courtier        = require('../MongoSchemes/courtiers'),
        Architecte      = require('../MongoSchemes/architectes'),
        PresidentCS     = require('../MongoSchemes/presidentCS'),
        Prestataire     = require('../MongoSchemes/prestataires'),
        Gestionnaire    = require('../MongoSchemes/gestionnaires');

const   Copro       = require('../MongoSchemes/copros'),
        Batiment    = require('../MongoSchemes/batiments');

const   Devis   = require('../MongoSchemes/devis'),
        Visite  = require('../MongoSchemes/visites');

/************/
/* Function */
/************/

/*** demande Visite ***/

let demandeVisite = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Visite.findOne({coproId: req.body.coproId}, function (err, visite) {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (visite)
                res.status(403).send({success: false, message: 'une visite a déjà été demandé'});
            else {
                let visite;
                if (req.user.role !== 'syndic')
                    visite = new Visite({
                        coproId    	    : req.body.coproId,
                        nomCopro        : req.body.nomCopro,
                        reference       : req.body.reference,
                        syndicId        : req.body.syndicId,
                        demandeLe       : new Date(),
                        done            : false
                    });
                else
                    visite = new Visite({
                        coproId    	    : req.body.coproId,
                        nomCopro        : req.body.nomCopro,
                        reference       : req.body.reference,
                        syndicId        : req.body.syndicId,
                        gestionnaireId  : req.body.gestionnaireId,
                        demandeLe       : new Date(),
                        done            : false
                    });
                visite.save(function(err, v) {
                    if (err || !v)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else
                        res.send(200).send({success: true, message: 'requête visite envoyée'})
                });
            }
        })
    }
}

let assignerVisite = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Visite.findOneAndUpdate(
            {_id: req.body._id},
            {$set: {architecteId: req.body.architecteId}},
            {new: true},
            function (err, visite) {
                if (err || !visite)
                    res.status(400).send({success: false, message: 'erreur system', err});
                else
                    res.status(200).send({success: true, message: 'visite assignée'});
            })
    }
}

let assignerCourtierToCopro = (req, res) => {
    let {copro, courtier} = req.body;
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Copro.findOneAndUpdate(
            {_id: copro},
            {$set: {courtiers: courtier}},
            {new: true},
            function (err, cop) {
                if (err || !cop)
                    res.status(403).send({success: false, message: 'erreur assigniation dans copro', err});
                else {
                    Courtier.findOneAndUpdate(
                        {_id: courtier},
                        {$push: {parc: cop._id}},
                        {new: true},
                        function (err, court) {
                            if (err || !court)
                                res.status(400).send({success: false, message: 'erreur assigniation dans courtier', err});
                            else
                                res.status(200).send({success: true, message: "le courtier a bien été assigné"})
                        })
                }
            })
}

let assignerCourtierToSyndic = (req, res) => {
    let {syndic, courtier} = req.body;
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Syndic.findOneAndUpdate(
            {_id: syndic},
            {$push: {courtiers: courtier}},
            {new: true},
            function (err, synd) {
                if (err || !synd)
                    res.status(403).send({success: false, message: 'erreur assigniation dans syndic', err});
                else {
                    Courtier.findOneAndUpdate(
                        {_id: courtier},
                        {$push: {syndics: syndic}},
                        {new: true},
                        function (err, court) {
                            if (err || !court)
                                res.status(400).send({success: false, message: 'erreur assigniation dans courtier', err});
                            else
                                res.status(200).send({success: true, message: "le courtier a bien été assigné"})
                        })
                }
            })
}

/* Export Functions */

module.exports = {
    demandeVisite,
    assignerVisite,
    assignerCourtierToCopro,
    assignerCourtierToSyndic,
}

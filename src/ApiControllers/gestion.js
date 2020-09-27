/****************************************/
/*** import modules from node_modules ***/
/****************************************/

let bcrypt  = require('bcryptjs');
let multer  = require('multer');
let path    = require("path");

/***************/
/*** helpers ***/
/***************/

let {
    sendCredentials,
    sendDemandeCourtier,
    sendDemandePrestataire,
} = require('../Config/mailer');

let {
    generateP,
    salt
} = require('./create');

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

const   Devis       = require('../MongoSchemes/devis'),
        Visite      = require('../MongoSchemes/visites'),
        Incident    = require('../MongoSchemes/incidents');

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
                Copro.findOne({_id: req.body.coproId}, function (err, copro) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!copro)
                        res.status(403).send({success: false, message: "la Copro n'existe pas"});
                    else {
                        let visite;
                        if (req.user.role !== 'syndic')
                            visite = new Visite({
                                coproId    	    : copro._id,
                                nomCopro        : copro.nomCopro,
                                reference       : copro.reference,
                                gardien         : req.body.gardien,
                                accessCode      : req.body.accessCode,
                                cleCabinet      : req.body.cleCabinet,
                                commentaire     : req.body.commentaire,
                                nomPCS          : req.body.nomPCS,
                                emailPCS        : req.body.emailPCS,
                                phonePCS        : req.body.phonePCS,
                                syndicId        : copro.syndicNominated ? copro.syndicNominated : copro.syndicEnCours,
                                demandeLe       : new Date(),
                                done            : false
                            });
                        else
                            visite = new Visite({
                                coproId    	    : copro._id,
                                nomCopro        : copro.nomCopro,
                                reference       : copro.reference,
                                gardien         : req.body.gardien,
                                accessCode      : req.body.accessCode,
                                cleCabinet      : req.body.cleCabinet,
                                commentaire     : req.body.commentaire,
                                nomPCS          : req.body.nomPCS,
                                emailPCS        : req.body.emailPCS,
                                phonePCS        : req.body.phonePCS,
                                syndicId        : copro.syndicNominated ? copro.syndicNominated : copro.syndicEnCours,
                                gestionnaireId  : copro.gestionnaire,
                                demandeLe       : new Date(),
                                done            : false
                            });
                        visite.save(async function(err, v) {
                            if (err || !v)
                                res.status(400).send({success: false, message: 'erreur system', err});
                            else {
                                await Copro.updateOne(
                                    {_id: copro._id},
                                    {$set: {dateDemandeVisite: new Date()}},
                                    async function (err) {
                                        if (err)
                                            res.status(400).send({success: false, message: 'erreur system', err});
                                        else {
                                            let password = await generateP();
                                            let pcs = new PresidentCS({
                                                email   : req.body.emailPCS,
                                                lastName: req.body.nomPCS,
                                                password: bcrypt.hashSync(password, salt),
                                                phone   : req.body.phonePCS,
                                                coproId : copro._id,
                                            });
                                            pcs.save(async function (err, p) {
                                                if (err)
                                                    console.log(err);
                                                else {
                                                    sendCredentials(req.body.emailPCS.toLowerCase(), password);
                                                    await Copro.findOneAndUpdate(
                                                        {_id: copro._id},
                                                        {$set: {pcs: p._id}},
                                                        {new: true},
                                                        function (err) {
                                                            if (err)
                                                                console.log(err)
                                                        });
                                                    res.send(200).send({success: true, message: 'requête visite envoyée'});
                                                }
                                            });
                                        }
                                    });
                            }
                        });
                    }
                })
            }
        })
    }
}

let assignerVisite = async (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        let error = [];
        await req.body.visites.map(visite => {
            Visite.findOneAndUpdate(
                {_id: visite},
                {$set: {architecteId: req.body.architecteId}},
                {new: true},
                function (err, visite) {
                    if (err || !visite)
                        error.push(err)
                    else
                        Architecte.findOneAndUpdate(
                            {_id: req.body.architecteId},
                            {$push: {copros: visite.coproId}},
                            {new: true},
                            (err) => {
                                if (err)
                                    error.push(err)
                            });
                });
        });
        if (error.length > 0)
            res.status(400).send({success: true, message: 'une ou plusieurs visites non assignées', error});
        else
            res.status(200).send({success: true, message: 'visite(s) assignée(s)'});
    }
}

let desassignerVisite = async (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        let error = [];
        await req.body.visites.map(visite => {
            Visite.findOneAndUpdate(
                {_id: visite},
                {$set: {architecteId: null}},
                {new: true},
                function (err, visite) {
                    if (err || !visite)
                        error.push(visite)
                    else
                        Architecte.findOneAndUpdate(
                            {_id: req.body.architecteId},
                            {$pull: {copros: visite.coproId}},
                            {new: true},
                            (err) => {
                                if (err)
                                    error.push(err)
                            });
                })
        });
        if (error.length > 0)
            res.status(400).send({success: true, message: "une ou plusieurs visites n'ont pû être supprimées", error});
        else
            res.status(200).send({success: true, message: 'visite(s) supprimée(s)'});
    }
}

let demandeCourtier = async (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        await sendDemandeCourtier(req.body);
        res.status(200).send({success: true, message: "demande envoyé, un administrateur va l'étudier"})
    }
}

let demandePrestataire = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Syndic.findOne({_id: req.user.id}, async function (err, synd) {
            if (err || !synd)
                res.status(400).send({success: false, message: "erreur système", err});
            else {
                let body = {
                    ...req.body,
                    nomSyndic: synd.nomSyndic
                }
                await sendDemandePrestataire(body);
                res.status(200).send({success: true, message: "demande envoyée"});
            }
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

let assignerPrestataireToSyndic = (req, res) => {
    const {prestataireId, syndicId} = req.body;
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else if (!prestataireId || !syndicId)
        res.status(403).send({success: false, message: 'syndicId et prestataireId requis'});
    else
        Syndic.findOneAndUpdate(
            {_id: syndic},
            {$push: {prestataires: prestataireId}},
            {new: true},
            function (err, synd) {
                if (err || !synd)
                    res.status(403).send({success: false, message: 'erreur assigniation dans syndic', err});
                else {
                    Prestataire.findOneAndUpdate(
                        {_id: prestataireId},
                        {$push: {syndics: syndicId}},
                        {new: true},
                        function (err, prest) {
                            if (err || !prest)
                                res.status(400).send({success: false, message: 'erreur assigniation dans prestataire', err});
                            else
                                res.status(200).send({success: true, message: "le prestataire a bien été assigné"})
                        })
                }
            })
}

let assignerGestionnaireToCopro = (req, res) => {
    const {gestionnaireId, coproId, isParc} = req.body;
    if (req.user.role !== 'syndic')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Copro.findOneAndUpdate(
            {$and: [{_id: coproId},{$or: [{syndicNominated: req.user.id}, {syndicEnCours: req.user.id}]}]},
            {$set: {gestionnaire: gestionnaireId}},
            {new: true}, function (err, copro) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else if (!copro)
                    res.status(404).send({success: false, message: "cette Copropriété n'existe pas"});
                else {
                    if (isParc)
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$push: {parc: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été ajouté au parc de "+gest.firstName
                                        })
                            }
                        )
                    else
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$push: {enCoursSelect: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été ajouté à la liste 'en cours de selection' de "+gest.firstName
                                        })
                            }
                        )
                }
            })
}

let desassignerGestionnaireToCopro = (req, res) => {
    const {gestionnaireId, coproId, isParc} = req.body;
    if (req.user.role !== 'syndic')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Copro.findOneAndUpdate(
            {$and: [{_id: coproId},{$or: [{syndicNominated: req.user.id}, {syndicEnCours: req.user.id}]}]},
            {$set: {gestionnaire: null}},
            {new: true}, function (err, copro) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else if (!copro)
                    res.status(404).send({success: false, message: "cette Copropriété n'existe pas"});
                else {
                    if (isParc)
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$pull: {parc: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été supprimée du parc de "+gest.firstName
                                        })
                            }
                        )
                    else
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$pull: {enCoursSelect: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été supprimée de la liste 'en cours de selection' de "+gest.firstName
                                        })
                            }
                        )
                }
            })
}

let deleteSyndic = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Syndic.findOne({_id: req.body._id}, async function (err, synd) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else if (!synd)
                res.status(404).send({success: false, message: "ce Syndic n'existe pas"});
            else {
                await Gestionnaire.deleteMany({syndic: synd._id}, function (err) {
                    if (err)
                        console.log('delete Gestionnaire error: ', err);
                });
                await Copro.find({syndicNominated: synd._id}, function (err, copros) {
                    if (err)
                        console.log('find Copros error: ', err);
                });
                await Batiment.deleteMany({coproId: {$in: synd.parc}}, function (err) {
                    if (err)
                        console.log('delete Batiment error: ', err);
                });
                await Courtier.updateMany(
                    {syndics: {$elemMatch: {$eq: synd._id}}},
                    {$pull: {syndics: synd._id}},
                    function (err) {
                        if (err)
                            console.log('update Courtier err: ', err)
                    });
                await Architecte.updateMany(
                    {copros: {$elemMatch: {$in: synd.parc}}},
                    {$pull: {copros: {$in: synd.parc}}},
                    function (err) {
                        if (err)
                            console.log('update architecte err: ', err)
                    });
                await Visite.deleteMany({syndicId: synd._id}, function (err) {
                    if (err)
                        console.log('delete Visites error: ', err);
                });
                await Prestataire.updateMany(
                    {syndics: {$elemMatch: {$eq: synd._id}}},
                    {$pull: {syndics: synd._id}},
                    function (err) {
                        if (err)
                            console.log('update Prestataire error: ', err)
                    });
                Syndic.deleteOne({_id: synd._id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else
                        res.status(200).send({success: false, message: 'Syndic supprimé avec succès'});
                });
            }
        })
}

let changeStatusCopro = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {coproId, isParc} = req.body;
        if (isParc)
            Copro.findOne({_id: coproId}, function (err, copro) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else
                    Copro.findOneAndUpdate(
                        {_id: copro._id},
                        {$set: {syndicNominated: copro.syndicEnCours}, $pull: {syndicEnCours: copro.syndicEnCours}},
                        {new: true},
                        function (err, cpr) {
                            if (err)
                                res.status(400).send({success: false, message: 'erreur système', err});
                            else
                                Syndic.findOneAndUpdate(
                                    {_id: cpr.syndicNominated},
                                    {$push: {parc: cpr._id}, $pull: {enCoursSelect: cpr._id}},
                                    {new: true},
                                    function (err) {
                                        if (err)
                                            res.status(400).send({success: false, message: 'erreur système', err});
                                        else if (cpr.gestionnaire !== null)
                                            Gestionnaire.findOneAndUpdate(
                                                {_id: cpr.gestionnaire},
                                                {
                                                    $push: {parc: cpr._id},
                                                    $pull: {enCoursSelect: cpr._id},
                                                    $set: {syndicDateNom: new Date()}
                                                    },
                                                {new: true},
                                                function (err) {
                                                    if (err)
                                                        res.status(400).send({success: false, message: 'erreur système', err});
                                                });
                                        else
                                            res.status(200).send({success: true, message: "la copropriété est maintenant dans le Parc"});
                                    });
                        });
            });
        else
            Copro.findOne({_id: coproId}, function (err, copro) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else
                    Copro.findOneAndUpdate(
                        {_id: copro._id},
                        {$set: {syndicNominated: null}, $push: {syndicEnCours: copro.syndicNominated}},
                        {new: true},
                        (error, cpr) => {
                            if (error)
                                res.status(400).send({success: false, message: 'erreur système', err: error});
                            else
                                Syndic.findOneAndUpdate(
                                    {_id: cpr.syndicEnCours},
                                    {$pull: {parc: cpr._id}, $push: {enCoursSelect: cpr._id}},
                                    {new: true},
                                    function (err) {
                                        if (err)
                                            res.status(400).send({success: false, message: 'erreur système', err});
                                        else if (cpr.gestionnaire !== null)
                                            Gestionnaire.findOneAndUpdate(
                                                {_id: cpr.gestionnaire},
                                                {$pull: {parc: cpr._id}, $push: {enCoursSelect: cpr._id}},
                                                {new: true},
                                                function (err) {
                                                    if (err)
                                                        res.status(400).send({success: false, message: 'erreur système', err});
                                                });
                                        else
                                            res.status(200).send({success: true, message: "la copropriété est maintenant en cours de sélection"});
                                    });
                        });
            });
    }
}

let deleteCopro = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {_id} = req.body;

        Copro.deleteOne({_id}, function (err) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else {
                Architecte.findOneAndUpdate(
                    {copros: {$elemMatch: {$eq: _id}}},
                    {$pull: {copros: _id}},
                    function (err) {
                        if (err)
                            res.status(400).send({success: false, message: 'erreur système', err});
                    });
                Courtier.findOneAndUpdate({parc: {$elemMatch: {$eq: _id}}},
                    {$pull: {parc: _id}},
                    function (err) {
                        if (err)
                            res.status(400).send({success: false, message: 'erreur système', err});
                    });
                Visite.deleteMany({coproId: _id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                });
                Batiment.deleteMany({coproId: _id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                });
                Incident.deleteMany({coproId: _id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                });
                if (req.user.role !== 'syndic')
                    Syndic.findOneAndUpdate(
                        {_id: req.user.id},
                        {$pull: {parc: _id, enCoursSelect: _id}},
                        {new: true},
                        function (err, synd) {
                            if (err)
                                res.status(400).send({success: false, message: 'erreur système', err});
                            else
                                res.status(200).send({success: true, message: 'copro supprimée'});
                        });
                else
                    Gestionnaire.findOneAndUpdate(
                        {_id: req.user.id},
                        {$pull: {parc: _id, enCoursSelect: _id}},
                        {new: true},
                        function (err) {
                            if (err)
                                res.status(400).send({success: false, message: 'erreur système', err});
                            else
                                res.status(200).send({success: true, message: 'copro supprimée'});
                        });
            }
        })
    }
}

/* Export Functions */

module.exports = {
    deleteCopro,
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
}

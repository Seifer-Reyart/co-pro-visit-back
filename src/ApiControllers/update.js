/**********************/
/*** Import Modules ***/
/**********************/

let bcrypt  = require('bcryptjs');

/*************************************/
/****| generate crypted password |****/
let salt = bcrypt.genSaltSync(10);
/*************************************/

/****************************/
/*** import Mongo Schemes ***/
/****************************/



const   Copro       = require('../MongoSchemes/copros'),
        Batiment    = require('../MongoSchemes/batiments'),
        Devis       = require('../MongoSchemes/devis');

const   PCS = require('../MongoSchemes/presidentCS'),
        Syndic = require('../MongoSchemes/syndics'),
        Courtier = require('../MongoSchemes/courtiers'),
        Architecte = require('../MongoSchemes/architectes'),
        PresidentCS = require('../MongoSchemes/presidentCS'),
        Prestataire = require('../MongoSchemes/prestataires'),
        Gestionnaire = require('../MongoSchemes/gestionnaires');

/****************/
/*** Function ***/
/****************/

/*************************/
/*| update credientials |*/
/*************************/

let updateCredentials = async (req, res) => {
    let password = '';
    if (req.body.password) {
        password = bcrypt.hashSync(req.body.password, salt);
    }
    const {email} = req.body;

    if (req.user.role === 'prestataire') {
        if (password) {
            Prestataire.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email, password}},
                {new: true},
                (err, prest) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!prest)
                        res.status(404).send({success: false, message: "ce Prestataire n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour"});
                });

        } else {
            Prestataire.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email}},
                {new: true},
                (err, prest) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!prest)
                        res.status(404).send({success: false, message: "ce Prestataire n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour", prestataire: prest});
                });
        }
    } else if (req.user.role === 'architecte') {
        if (password) {
            Architecte.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email, password}},
                {new: true},
                (err, architecte) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!architecte)
                        res.status(404).send({success: false, message: "cet Architecte n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour"});
                });

        } else {
            Architecte.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email}},
                {new: true},
                (err, architecte) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!architecte)
                        res.status(404).send({success: false, message: "cet Architecte n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour", architecte});
                });
        }
    } else if (req.user.role === 'courtier') {
        if (password) {
            Courtier.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email, password}},
                {new: true},
                (err, courtier) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!courtier)
                        res.status(404).send({success: false, message: "ce Courtier n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour"});
                });

        } else {
            Courtier.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email}},
                {new: true},
                (err, courtier) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!courtier)
                        res.status(404).send({success: false, message: "ce Courtier n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour", courtier});
                });
        }
    } else if (req.user.role === 'syndic') {
        if (password) {
            Syndic.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email, password}},
                {new: true},
                (err, syndic) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!syndic)
                        res.status(404).send({success: false, message: "ce Syndic n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour"});
                });

        } else {
            Syndic.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email}},
                {new: true},
                (err, syndic) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!syndic)
                        res.status(404).send({success: false, message: "ce Syndic n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour", syndic});
                });
        }
    } else if (req.user.role === 'gestionnaire') {
        if (password) {
            Gestionnaire.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email, password}},
                {new: true},
                (err, gestionnaire) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!gestionnaire)
                        res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour"});
                });

        } else {
            Gestionnaire.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email}},
                {new: true},
                (err, gestionnaire) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!gestionnaire)
                        res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour", gestionnaire});
                });
        }
    } else if (req.user.role === 'pcs') {
        if (password) {
            PresidentCS.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email, password}},
                {new: true},
                (err, pcs) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!pcs)
                        res.status(404).send({success: false, message: "ce PCS n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour"});
                });

        } else {
            PresidentCS.findOneAndUpdate(
                {_id: req.user.id},
                {$set: {email}},
                {new: true},
                (err, pcs) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!pcs)
                        res.status(404).send({success: false, message: "ce PCS n'existe pas!"});
                    else
                        res.status(200).send({success: true, message: "identifiants mis à jour", pcs});
                });
        }
    } else {
        res.status(401).send({success: false, message: 'accès interdit'});
    }
}

/***************************/
/*| complete/update Copro |*/
/***************************/

let updateCopro = (req, res) => {
    const {_id} = req.body.update;
    let {update} = req.body;
    delete update._id;

    if (req.user.role !== 'gestionnaire' && req.user.role !== 'syndic') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        Copro.findOneAndUpdate({_id}, {$set: update}, {new: true}, (err, copro) => {
            if (err)
                res.status(400).send({success: false, message: err});
            if (!copro)
                res.status(400).send({success: false, message: 'pas de retour copro'});
            else
                res.status(200).send({success: true, message: 'La Copro a été mise à jour', copro});
        });
    }
}

/*************************/
/*| update Gestionnaire |*/
/*************************/

let updateGestionnaire = (req, res) => {
    if (req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {permissions, _id} = req.body;
        Gestionnaire.findOneAndUpdate(
            {_id},
            {$set: {permissions}},
            {new: true},
            function (err, gestionnaire) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else
                    res.status(200).send({success: true, message: 'changement de droits effectué', gestionnaire});
            });
    }
}
/************************/
/*| update Prestataire |*/
/************************/

let updateInfosPresta = (req, res) => {
    if (req.user.role !== 'prestataire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Prestataire.findOneAndUpdate(
            {_id: req.user.id},
            {$set: req.body},
            {new: true},
            (err, prest) => {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else if (!prest)
                    res.status(404).send({success: false, message: "ce Prestataire n'existe pas"});
                else
                    res.status(200).send({success: true, message: 'informations mise à jours'});
            }
        );
    }
};



/************************/
/*** Export Functions ***/
/************************/

module.exports = {
    updateCopro,
    updateGestionnaire,
    updateCredentials,
    updateInfosPresta,
}

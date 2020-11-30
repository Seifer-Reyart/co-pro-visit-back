/**********************/
/*** Import Modules ***/
/**********************/

let bcrypt  = require('bcryptjs');

/*************************************/
/****| generate crypted password |****/
let salt = bcrypt.genSaltSync(10);

function generateP() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    while (pass.length <= 15) {
        let char = Math.floor(Math.random() * str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
}

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
        architecte = require('../MongoSchemes/architectes'),
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
        password = await generateP();
        password = bcrypt.hashSync(password, salt);
    }
    const {email} = req.body;

    if (req.user.role === 'prestataire') {
        Prestataire.findOne({email}, function (err, presta) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else if (presta && presta._id !== req.user.id)
                res.status(403).send({success: false, message: "cet email est déjà utilisé"});
            else {
                if (password) {
                    Prestataire.findOneAndUpdate(
                        {_id: req.user.id},
                        {$set: {email, password}},
                        {new: true},
                        (err, prest) => {
                            if (err)
                                res.status(400).send({success: false, message: 'erreur système', err});
                            else if (!prest)
                                res.status(404).send({success: false, message: "ce PRestataire n'existe pas!"});
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
                                res.status(404).send({success: false, message: "ce PRestataire n'existe pas!"});
                            else
                                res.status(200).send({success: true, message: "identifiants mis à jour", prestataire: prest});
                        });
                }
            }
        })
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

let update;

/************************/
/*** Export Functions ***/
/************************/

module.exports = {
    updateCopro,
    updateGestionnaire,
    updateCredentials,
}

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

const   Admin           = require('../MongoSchemes/admins'),
        Syndic          = require('../MongoSchemes/syndics'),
        Courtier        = require('../MongoSchemes/courtiers'),
        Architecte      = require('../MongoSchemes/architectes'),
        PresidentCS     = require('../MongoSchemes/presidentCS'),
        Prestataire     = require('../MongoSchemes/prestataires'),
        Gestionnaire    = require('../MongoSchemes/gestionnaires');

/************/
/* Function */
/************/

let login = async (req, res) => {
    const {email, password} = req.body;

    Admin.findOne({email: email.toLowerCase()}, async (err, user) => {
        if (err)
            res.status(400).send({success: false, message: err});
        else if (user) {
            if (!bcrypt.compareSync(password, user.password))
                res.status(403).send({success: false, message: "mot de passe incorrect"});
            else {
                user.token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                res.status(200).send({success: true, message: 'connexion réussie', user});
            }
        } else {
            Syndic.findOne({email: email.toLowerCase()}, async (err, user) => {
                if (err)
                    res.status(400).send({success: false, message: err});
                else if (user) {
                    if (!bcrypt.compareSync(password, user.password))
                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                    else {
                        user.token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                        res.status(200).send({success: true, message: 'connexion réussie', user});
                    }
                } else {
                    Courtier.findOne({email: email.toLowerCase()}, async (err, user) => {
                        if (err)
                            res.status(400).send({success: false, message: err});
                        else if (user) {
                            if (!bcrypt.compareSync(password, user.password))
                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                            else {
                                user.token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                res.status(200).send({success: true, message: 'connexion réussie', user});
                            }
                        } else {
                            Architecte.findOne({email: email.toLowerCase()}, async (err, user) => {
                                if (err)
                                    res.status(400).send({success: false, message: err});
                                else if (user) {
                                    if (!bcrypt.compareSync(password, user.password))
                                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                                    else {
                                        user.token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                        res.status(200).send({success: true, message: 'connexion réussie', user});
                                    }
                                } else {
                                    PresidentCS.findOne({email: email.toLowerCase()}, async (err, user) => {
                                        if (err)
                                            res.status(400).send({success: false, message: err});
                                        else if (user) {
                                            if (!bcrypt.compareSync(password, user.password))
                                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                                            else {
                                                user.token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                                res.status(200).send({success: true, message: 'connexion réussie', user});
                                            }
                                        } else {
                                            Prestataire.findOne({email: email.toLowerCase()}, async (err, user) => {
                                                if (err)
                                                    res.status(400).send({success: false, message: err});
                                                else if (user) {
                                                    if (!bcrypt.compareSync(password, user.password))
                                                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                                                    else {
                                                        user.token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                                        res.status(200).send({success: true, message: 'connexion réussie', user});
                                                    }
                                                } else {
                                                    Gestionnaire.findOne({email: email.toLowerCase()}, async (err, user) => {
                                                        if (err)
                                                            res.status(400).send({success: false, message: err});
                                                        else if (user) {
                                                            if (!bcrypt.compareSync(password, user.password))
                                                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                                                            else {
                                                                user.token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                                                res.status(200).send({success: true, message: 'connexion réussie', user});
                                                            }
                                                        } else {
                                                            res.status(404).send({success: false, message: 'utilisateur introuvable'});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

/* Export Functions */

module.exports = {
    login
}
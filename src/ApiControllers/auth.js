/************************************/
/* import modules from node_modules */
/************************************/

let bcrypt  = require('bcryptjs');
let jwt     = require('jsonwebtoken');
let salt = bcrypt.genSaltSync(10);

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

/*************/
/* Functions */
/*************/

/* Fonction de connexion à la plateforme */

let login = async (req, res) => {
    const {email, password} = req.body;

    //Connexion Admin//
    Admin.findOne({email: email.toLowerCase()}, async (err, user) => {
        if (err)
            res.status(400).send({success: false, message: err});
        else if (user) {
            if (!bcrypt.compareSync(password, user.password))
                res.status(403).send({success: false, message: "mot de passe incorrect"});
            else {
                let token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                delete user.password;
                res.status(200).send({success: true, message: 'connexion réussie', user, token});
            }
        } else {
            //Connexion Syndic//
            Syndic.findOne({email: email.toLowerCase()}, async (err, user) => {
                if (err)
                    res.status(400).send({success: false, message: err});
                else if (user) {
                    if (!bcrypt.compareSync(password, user.password))
                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                    else {
                        let token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                        delete user.password;
                        res.status(200).send({success: true, message: 'connexion réussie', user, token});
                    }
                } else {
                    //Connexion Courtier//
                    Courtier.findOne({email: email.toLowerCase()}, async (err, user) => {
                        if (err)
                            res.status(400).send({success: false, message: err});
                        else if (user) {
                            if (!bcrypt.compareSync(password, user.password))
                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                            else {
                                let token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                delete user.password;
                                res.status(200).send({success: true, message: 'connexion réussie', user, token});
                            }
                        } else {
                            //Connexion Architecte//
                            Architecte.findOne({email: email.toLowerCase()}, async (err, user) => {
                                if (err)
                                    res.status(400).send({success: false, message: err});
                                else if (user) {
                                    if (!bcrypt.compareSync(password, user.password))
                                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                                    else {
                                        let token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                        delete user.password;
                                        res.status(200).send({success: true, message: 'connexion réussie', user, token});
                                    }
                                } else {
                                    //Connexion President du Conseil Syndical//
                                    PresidentCS.findOne({email: email.toLowerCase()}, async (err, user) => {
                                        if (err)
                                            res.status(400).send({success: false, message: err});
                                        else if (user) {
                                            if (!bcrypt.compareSync(password, user.password))
                                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                                            else {
                                                let token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                                delete user.password;
                                                res.status(200).send({success: true, message: 'connexion réussie', user, token});
                                            }
                                        } else {
                                            //Connexion Prestataire//
                                            Prestataire.findOne({email: email.toLowerCase()}, async (err, user) => {
                                                if (err)
                                                    res.status(400).send({success: false, message: err});
                                                else if (user) {
                                                    if (!bcrypt.compareSync(password, user.password))
                                                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                                                    else {
                                                        let token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                                        delete user.password;
                                                        res.status(200).send({success: true, message: 'connexion réussie', user, token});
                                                    }
                                                } else {
                                                    //Connexion Gestionnaire//
                                                    Gestionnaire.findOne({email: email.toLowerCase()}, async (err, user) => {
                                                        if (err)
                                                            res.status(400).send({success: false, message: err});
                                                        else if (user) {
                                                            if (!bcrypt.compareSync(password, user.password))
                                                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                                                            else {
                                                                let token = await jwt.sign({id: user._id, role: user.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24 * 30});
                                                                delete user.password;
                                                                res.status(200).send({success: true, message: 'connexion réussie', user, token});
                                                            }
                                                        } else {
                                                            res.status(404).send({success: false, message: 'utilisateur introuvable'});
                                                        }
                                                    });
                                                }
                                            }).populate({ model: 'incidents', path: 'incidentId' }); // Envoyer la liste des incidents associés en cas de connexion Prestataire
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

/* Fonction création d'un Admin */

let createAdmin = (req, res) => {
    let admin = new Admin({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, salt),
        role: 'admin'
    });


    admin.save(function(err) {
        if (err) {
            res.send({ success: false, message: "Erreur lors de la création de l'Admin", err});
        } else {
            res.send({ success: true, message : "L'Admin a bien été créé"});
        }
    })
}

/* Export Functions */

module.exports = {
    login,
    createAdmin
}

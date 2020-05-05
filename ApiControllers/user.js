/************************************/
/* import modules from node_modules */
/************************************/

let bCrypt  = require('bcryptjs');
let jwt     = require('jsonwebtoken');
let moment  = require('moment');

/************************/
/* import local modules */
/************************/

const secretExpr  = require('../ApiConfig/tsconfig');
const {
    admins,
    syndics,
    courtiers,
    architectes,
    prestataires
}  = require('../models/users');

/*************/
/* functions */
/*************/

/**** slat to crypt passwords ****/
 let salt = bCrypt.genSaltSync(10);
/*********************************/

/* register new user */
let registerUser = function (req, res) {
    let user = {};
    admins.findOne({$or: [{username: req.body.user.username}, {email: req.body.user.email}]}, function (err, admin) {
        if (admin) {
            user = admin;
            res.status(403).send({status: false, message: 'identifiant et/ou email déjà utilisé(s)'});
        } else
            syndics.findOne({$or: [{username: req.body.user.username}, {email: req.body.user.email}]}, function (err, syndic) {
                if (syndic) {
                    user = syndic;
                    res.status(403).send({status: false, message: 'identifiant et/ou email déjà utilisé(s)'});
                } else
                    courtiers.findOne({$or: [{username: req.body.user.username}, {email: req.body.user.email}]}, function (err, courtier) {
                        if (courtier) {
                            user = courtier;
                            res.status(403).send({status: false, message: 'identifiant et/ou email déjà utilisé(s)'});
                        } else
                            architectes.findOne({$or: [{username: req.body.user.username}, {email: req.body.user.email}]}, function (err, architecte) {
                                if (architecte) {
                                    user = architecte;
                                    res.status(403).send({status: false, message: 'identifiant et/ou email déjà utilisé(s)'});
                                } else
                                    prestataires.findOne({$or: [{username: req.body.user.username}, {email: req.body.user.email}]}, function (err, prestataire) {
                                        if (prestataire) {
                                            user = prestataire;
                                            res.status(403).send({
                                                status: false,
                                                message: 'identifiant et/ou email déjà utilisé(s)'
                                            });
                                        } else {
                                            console.log('no user found')
                                        }
                                    })
                            })
                    })
            })
    })

    if (req.body.user.role === 'admin' && !user._id) {
        let adminSave = new admins({
            email: req.body.user.email.toLowerCase(),
            password: bCrypt.hashSync(req.body.user.password, salt),
            username: req.body.user.username.toLowerCase(),
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            sex: req.body.user.sex,
            registerDate: new Date(),
            phone: req.body.user.phone,
            role: 'admin'
        });
        adminSave.save(function (err, user) {
            if (err) {
                res.status(400).send({status: false, message: 'echec de l\'inscription'});
            } else {
                res.status(200).send({
                    status: true,
                    message: 'inscription réussie',
                    user: user
                });
            }
        });
    } else if (req.body.user.role === 'syndic' && !user._id) {
        let syndicSave = new syndics({
            entreprise: {
                raisonSociale: req.body.user.raisonSociale.toLowerCase(),
                siren: req.body.user.siren,
                codePostal: req.body.user.codePostal,
                ville: req.body.user.ville,
                phone: req.body.user.phoneEntreprise
            },
            representant: {
                civility: req.body.user.civility,
                lastName: req.body.user.lastName,
                firstName: req.body.user.firstName,
                phone: req.body.user.phoneRepresentant,
                email: req.body.user.email,
            },
            role: 'syndic'
        });
        syndicSave.save(function (err, user) {
            if (err) {
                res.status(400).send({status: false, message: 'echec de l\'inscription'});
            } else {
                res.status(200).send({
                    status: true,
                    message: 'inscription réussie',
                    user: user
                });
            }
        });
    } else if (req.body.user.role === ' courtier' && !user._id) {
        let courtierSave = new courtiers({
            entreprise: {
                raisonSociale: req.body.user.raisonSociale.toLowerCase(),
                siren: req.body.user.siren,
                codePostal: req.body.user.codePostal,
                ville: req.body.user.ville,
                phone: req.body.user.phoneEntreprise
            },
            representant: {
                civility: req.body.user.civility,
                lastName: req.body.user.lastName,
                firstName: req.body.user.firstName,
                phone: req.body.user.phoneRepresentant,
                email: req.body.user.email,
            },
            role: 'courtier'
        });
        courtierSave.save(function (err, user) {
            if (err) {
                res.status(400).send({status: false, message: 'echec de l\'inscription'});
            } else {
                res.status(200).send({
                    status: true,
                    message: 'inscription réussie',
                    user: user
                });
            }
        });
    } else if (req.body.user.role === 'architecte' && !user._id) {
        let architecteSave = new architectes({
            numeroAffiliationNationale: req.body.user.numeroAffiliationNationale,
            civility: req.body.user.civility,
            lastName: req.body.user.lastName,
            firstName: req.body.user.firstName,
            phone: req.body.user.phone,
            email: req.body.user.email,
            nomCabinet: req.body.user.nomCabinet,
            address: req.body.user.address,
            ville: req.body.user.ville,
            codePostal: req.body.user.codePostal,
            role: 'architecte'
        });
        architecteSave.save(function (err, user) {
            if (err) {
                res.status(400).send({status: false, message: 'echec de l\'inscription'});
            } else {
                res.status(200).send({
                    status: true,
                    message: 'inscription réussie',
                    user: user
                });
            }
        });
    } else if (req.body.user.role === 'prestataire' && !user._id) {
        let prestataireSave = new prestataires({
            entreprise: {
                nom: req.body.user.nom,
                address: req.body.user.address,
                codePostal: req.body.user.codePostal,
                ville: req.body.user.ville,
                phone: req.body.user.phone,
                email: req.body.user.email,
                nbSalaries: req.body.user.nbSalaries,
                siret: req.body.user.siret
            },
            gerant: {
                lastName: req.body.user.lastName,
                firstName: req.body.user.firstName,
                phone: req.body.user.phone,
                email: req.body.user.email,
                activities: req.body.user.activities
            },
            RCProfessionnelle: req.body.user.RCProfessionnelle,
            RCDecennale: req.body.user.RCDecennale,
            role: 'prestataire'
        });
        prestataireSave.save(function (err, user) {
            if (err) {
                res.status(400).send({status: false, message: 'echec de l\'inscription'});
            } else {
                res.status(200).send({
                    status: true,
                    message: 'inscription réussie',
                    user: user
                });
            }
        });
    }
};

/* login user */
let loginUser = function (req, res) {
    admins.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, admin) {
        if (err) {
            res.status(400).send({status: false, message: err});
        } else if (admin) {
            if (!bCrypt.compareSync(req.body.password, admin.password)) {
                res.status(403).send({status: false, message: "informations de connexion invalides"});
            } else {
                let token = jwt.sign({_id: admin._id, role: admin.role}, secretExpr.secret, {expiresIn: '7d'}); // generate new access token which expires after 7 days without login
                let date = new Date();
                date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now -- days to be added value may be taken from collection securityconfigs (field: tokenExpire)
                admins.findOneAndUpdate({"_id": admin._id},
                    {$set: {"tokenSession.token": token, "tokenSession.expire": date, "lastVisit": new Date()}},
                    {new: true},
                    function (err, doc) {
                        if (err)
                            console.log(err);
                        else
                            res.status(200).send({status: true, state: "connexion réussie", user: doc});
                    });
            }
        } else {
            syndics.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, syndic) {
                if (err) {
                    res.status(400).send({status: false, message: err});
                } else if (syndic) {
                    if (!bCrypt.compareSync(req.body.password, syndic.password)) {
                        res.status(403).send({status: false, message: "informations de connexion invalides"});
                    } else {
                        let token = jwt.sign({
                            _id: syndic._id,
                            role: syndic.role
                        }, secretExpr.secret, {expiresIn: '7d'}); // generate new access token which expires after 7 days without login
                        let date = new Date();
                        date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now -- days to be added value may be taken from collection securityconfigs (field: tokenExpire)
                        syndics.findOneAndUpdate({"_id": syndic._id},
                            {$set: {"tokenSession.token": token, "tokenSession.expire": date, "lastVisit": new Date()}},
                            {new: true},
                            function (err, doc) {
                                if (err)
                                    console.log(err);
                                else
                                    res.status(200).send({status: true, state: "connexion réussie", user: doc});
                            });
                    }
                } else {
                    courtiers.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, courtier) {
                        if (err) {
                            res.status(400).send({status: false, message: err});
                        } else if (courtier) {
                            if (!bCrypt.compareSync(req.body.password, courtier.password)) {
                                res.status(403).send({status: false, message: "informations de connexion invalides"});
                            } else {
                                let token = jwt.sign({
                                    _id: courtier._id,
                                    role: courtier.role
                                }, secretExpr.secret, {expiresIn: '7d'}); // generate new access token which expires after 7 days without login
                                let date = new Date();
                                date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now -- days to be added value may be taken from collection securityconfigs (field: tokenExpire)
                                courtiers.findOneAndUpdate({"_id": courtier._id},
                                    {
                                        $set: {
                                            "tokenSession.token": token,
                                            "tokenSession.expire": date,
                                            "lastVisit": new Date()
                                        }
                                    },
                                    {new: true},
                                    function (err, doc) {
                                        if (err)
                                            console.log(err);
                                        else
                                            res.status(200).send({status: true, state: "connexion réussie", user: doc});
                                    });
                            }
                        } else {
                            architectes.findOneAndUpdate({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, architecte) {
                                if (err) {
                                    res.status(400).send({status: false, message: err});
                                } else if (architecte) {
                                    if (!bCrypt.compareSync(req.body.password, architecte.password)) {
                                        res.status(403).send({
                                            status: false,
                                            message: "informations de connexion invalides"
                                        });
                                    } else {
                                        let token = jwt.sign({
                                            _id: architecte._id,
                                            role: architecte.role
                                        }, secretExpr.secret, {expiresIn: '7d'}); // generate new access token which expires after 7 days without login
                                        let date = new Date();
                                        date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now -- days to be added value may be taken from collection securityconfigs (field: tokenExpire)
                                        architectes.findOneAndUpdate({"_id": architecte._id},
                                            {
                                                $set: {
                                                    "tokenSession.token": token,
                                                    "tokenSession.expire": date,
                                                    "lastVisit": new Date()
                                                }
                                            },
                                            {new: true},
                                            function (err, doc) {
                                                if (err)
                                                    console.log(err);
                                                else
                                                    res.status(200).send({
                                                        status: true,
                                                        state: "connexion réussie",
                                                        user: doc
                                                    });
                                            });
                                    }
                                } else {
                                    prestataires.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, prestataire) {
                                        if (err) {
                                            res.status(400).send({status: false, message: err});
                                        } else if (prestataire) {
                                            if (!bCrypt.compareSync(req.body.password, prestataire.password)) {
                                                res.status(403).send({
                                                    status: false,
                                                    message: "informations de connexion invalides"
                                                });
                                            } else {
                                                let token = jwt.sign({
                                                    _id: prestataire._id,
                                                    role: prestataire.role
                                                }, secretExpr.secret, {expiresIn: '7d'}); // generate new access token which expires after 7 days without login
                                                let date = new Date();
                                                date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now -- days to be added value may be taken from collection securityconfigs (field: tokenExpire)
                                                prestataires.findOneAndUpdate({"_id": prestataire._id},
                                                    {
                                                        $set: {
                                                            "tokenSession.token": token,
                                                            "tokenSession.expire": date,
                                                            "lastVisit": new Date()
                                                        }
                                                    },
                                                    {new: true},
                                                    function (err, doc) {
                                                        if (err)
                                                            console.log(err);
                                                        else
                                                            res.status(200).send({
                                                                status: true,
                                                                state: "connexion réussie",
                                                                user: doc
                                                            });
                                                    });
                                            }
                                        } else {
                                            res.status(404).send({status: false, message: "utilisateur inconnu"});
                                        }
                                    })
                                }
                            });
                        }
                    })
                }
            })
        }
    })
};

/* logout user */
let logOutUser = function (req, res) {
    let date = new Date();
    date.setDate(date.getDate() - 7); // set token's end of validity to 30 days from now
    if (req.user.role === 'admin')
        admins.updateOne({"_id": req.user._id}, {
            $set: {
                "tokenSession.token": "",
                "tokenSession.expire": date
            }
        }, function (err) {
            if (err)
                res.send({status: false, message: err});
            else {
                res.send({status: true, message: "déconnexion réussie"});
            }
        })
    else if (req.user.role === 'syndic')
        syndics.updateOne({"_id": req.user._id}, {
            $set: {
                "tokenSession.token": "",
                "tokenSession.expire": date
            }
        }, function (err) {
            if (err)
                res.send({status: false, message: err});
            else {
                res.send({status: true, message: "déconnexion réussie"});
            }
        })
    else if (req.user.role === 'courtier')
        courtiers.updateOne({"_id": req.user._id}, {
            $set: {
                "tokenSession.token": "",
                "tokenSession.expire": date
            }
        }, function (err) {
            if (err)
                res.send({status: false, message: err});
            else {
                res.send({status: true, message: "déconnexion réussie"});
            }
        })
    else if (req.user.role === 'architectes')
        architectes.updateOne({"_id": req.user._id}, {
            $set: {
                "tokenSession.token": "",
                "tokenSession.expire": date
            }
        }, function (err) {
            if (err)
                res.send({status: false, message: err});
            else {
                res.send({status: true, message: "déconnexion réussie"});
            }
        })
    else if (req.user.role === 'prestataire')
        prestataires.updateOne({"_id": req.user._id}, {
            $set: {
                "tokenSession.token": "",
                "tokenSession.expire": date
            }
        }, function (err) {
            if (err)
                res.send({status: false, message: err});
            else {
                res.send({status: true, message: "déconnexion réussie"});
            }
        })
};

/* fetch user via his token if it's not expired*/

let fetchUserInfos = function (req, res) {
    if (!req.user) {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        // check date in token before send back user info, otherwhise... logout
        admins.findOne({"_id": req.user._id}, {"pin.value": 0, password: 0}, function (error, admin) {
            if (error)
                res.status(400).send({status: false, message: error})
            else if (admin)
                res.status(200).send({status: true, user: admin})
            else {
                syndics.findOne({"_id": req.user._id}, {"pin.value": 0, password: 0}, function (error, syndic) {
                    if (error)
                        res.status(400).send({status: false, message: error})
                    else if (syndic)
                        res.status(200).send({status: true, user: syndic})
                    else {
                        courtiers.findOne({"_id": req.user._id}, {
                            "pin.value": 0,
                            password: 0
                        }, function (error, courtier) {
                            if (error)
                                res.status(400).send({status: false, message: error})
                            else if (courtier)
                                res.status(200).send({status: true, user: courtier})
                            else {
                                architectes.findOne({"_id": req.user._id}, {
                                    "pin.value": 0,
                                    password: 0
                                }, function (error, architecte) {
                                    if (error)
                                        res.status(400).send({status: false, message: error})
                                    else if (architecte)
                                        res.status(200).send({status: true, user: architecte})
                                    else {
                                        prestataires.findOne({"_id": req.user._id}, {
                                            "pin.value": 0,
                                            password: 0
                                        }, function (error, prestataire) {
                                            if (error)
                                                res.status(400).send({status: false, message: error})
                                            else if (prestataire)
                                                res.status(200).send({status: true, user: prestataire})
                                            else {
                                                res.status(403).send({
                                                    status: false,
                                                    message: "utilisateur introuvable"
                                                });
                                            }

                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
};


module.exports = {
    registerUser,
    logOutUser,
    loginUser,
    fetchUserInfos
};

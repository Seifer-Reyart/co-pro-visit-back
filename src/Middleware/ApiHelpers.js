/************************/
/* import local modules */
/************************/
const   Admin           = require('../MongoSchemes/admins'),
        Syndic          = require('../MongoSchemes/syndics'),
        Courtier        = require('../MongoSchemes/courtiers'),
        Architecte      = require('../MongoSchemes/architectes'),
        PresidentCS     = require('../MongoSchemes/presidentCS'),
        Prestataire     = require('../MongoSchemes/prestataires'),
        Gestionnaire    = require('../MongoSchemes/gestionnaires'),
        Notifications   = require('../MongoSchemes/notifications');
/************************/

/**************************************/
/***    import external modules     ***/
/**************************************/

const crypto    = require('crypto');
const fs        = require('fs');
const bcrypt    = require('bcryptjs');
const multer    = require('multer');

/**************************************/

let checkEmailExist = async (req, res, next) => {
    let {email} = req.body;
    Admin.findOne({email}, (err, user) => {
        if (err)
            console.log(err)
        else if (user)
            res.status(403).send({status: false, message: "cet email est déjà utilisé"})
        else
            Syndic.findOne({email}, (err, user) => {
                if (err)
                    console.log(err)
                else if (user)
                    res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                else
                    Courtier.findOne({email}, (err, user) => {
                        if (err)
                            console.log(err)
                        else if (user)
                            res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                        else
                            Architecte.findOne({email}, (err, user) => {
                                if (err)
                                    console.log(err)
                                else if (user)
                                    res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                                else
                                    PresidentCS.findOne({email}, (err, user) => {
                                        if (err)
                                            console.log(err)
                                        else if (user)
                                            res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                                        else
                                            Prestataire.findOne({email}, (err, user) => {
                                                if (err)
                                                    console.log(err)
                                                else if (user)
                                                    res.status(403).send({
                                                        status: false,
                                                        message: "cet email est déjà utilisé"
                                                    })
                                                else
                                                    Gestionnaire.findOne({email}, (err, user) => {
                                                        if (err)
                                                            console.log(err)
                                                        else if (user)
                                                            res.status(403).send({
                                                                status: false,
                                                                message: "cet email est déjà utilisé"
                                                            })
                                                        else {
                                                            next();
                                                        }
                                                    })
                                            })
                                    })
                            })
                    })
            })
    })
}

let checkEmailBeforeUpdate = async (req, res, next) => {
    let {email} = req.body;
    Admin.findOne({email}, (err, user) => {
        if (err)
            console.log(err)
        else if (user && user._id.toString() !== req.user.id.toString())
            res.status(403).send({status: false, message: "cet email est déjà utilisé"})
        else
            Syndic.findOne({email}, (err, user) => {
                if (err)
                    console.log(err)
                else if (user && user._id.toString() !== req.user.id.toString())
                    res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                else
                    Courtier.findOne({email}, (err, user) => {
                        if (err)
                            console.log(err)
                        else if (user && user._id.toString() !== req.user.id.toString())
                            res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                        else
                            Architecte.findOne({email}, (err, user) => {
                                if (err)
                                    console.log(err)
                                else if (user && user._id.toString() !== req.user.id.toString())
                                    res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                                else
                                    PresidentCS.findOne({email}, (err, user) => {
                                        if (err)
                                            console.log(err)
                                        else if (user && user._id.toString() !== req.user.id.toString())
                                            res.status(403).send({status: false, message: "cet email est déjà utilisé"})
                                        else
                                            Prestataire.findOne({email}, (err, user) => {
                                                if (err)
                                                    console.log(err)
                                                else if (user && user._id.toString() !== req.user.id.toString())
                                                    res.status(403).send({
                                                        status: false,
                                                        message: "cet email est déjà utilisé"
                                                    })
                                                else
                                                    Gestionnaire.findOne({email}, (err, user) => {
                                                        if (err)
                                                            console.log(err)
                                                        else if (user && user._id.toString() !== req.user.id.toString())
                                                            res.status(403).send({
                                                                status: false,
                                                                message: "cet email est déjà utilisé"
                                                            })
                                                        else {
                                                            next();
                                                        }
                                                    })
                                            })
                                    })
                            })
                    })
            })
    })
}

const uploadFile = (filesArray, dest, filetypes) => {
    return filesArray?.length ? filesArray.map( file => {
        return new Promise((resolve) => {
            let mimetype = filetypes.test(file.mimetype);
            if (mimetype) {
                const hash = crypto.createHash('sha1')
                let hashedBuffer = file.buffer;
                hash.update(hashedBuffer);
                let extension = file.mimetype.match(filetypes);
                extension = extension?.length ? extension[0] : null;
                const savedFileName = `${hash.digest('hex')}.${extension}`
                fs.writeFile(`${dest}${savedFileName}`, file.buffer, (err) => {
                    if (err) {
                        resolve({
                            imagesUploadErrors: {
                                imageTitle: file.originalname,
                                err
                            },
                            imagesUploaded: null
                        });
                    }
                    else {
                        resolve({
                            imagesUploadErrors: null,
                            imagesUploaded: savedFileName
                        });

                    }
                })
            } else {
                resolve({
                    imagesUploadErrors: {
                        imageTitle: file.originalname,
                        err: "Mauvais format, reçu " + file.mimetype + ", attendu: " + filetypes
                    },
                    imagesUploaded: null
                });
            }
        })
    }) : null
}

const checkPassword = (req, res, next) => {
    const {email, password} = req.body;

    Admin.findOne({email: email.toLowerCase()}, async (err, user) => {
        if (err)
            res.status(400).send({success: false, message: err});
        else if (user) {
            if (!bcrypt.compareSync(password, user.password))
                res.status(403).send({success: false, message: "mot de passe incorrect"});
            else
                next();
        } else {
            Syndic.findOne({email: email.toLowerCase()}, async (err, user) => {
                if (err)
                    res.status(400).send({success: false, message: err});
                else if (user) {
                    if (!bcrypt.compareSync(password, user.password))
                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                    else
                        next();
                } else {
                    Courtier.findOne({email: email.toLowerCase()}, async (err, user) => {
                        if (err)
                            res.status(400).send({success: false, message: err});
                        else if (user) {
                            if (!bcrypt.compareSync(password, user.password))
                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                            else
                                next();
                        } else {
                            Architecte.findOne({email: email.toLowerCase()}, async (err, user) => {
                                if (err)
                                    res.status(400).send({success: false, message: err});
                                else if (user) {
                                    if (!bcrypt.compareSync(password, user.password))
                                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                                    else
                                        next()
                                } else {
                                    PresidentCS.findOne({email: email.toLowerCase()}, async (err, user) => {
                                        if (err)
                                            res.status(400).send({success: false, message: err});
                                        else if (user) {
                                            if (!bcrypt.compareSync(password, user.password))
                                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                                            else
                                                next()
                                        } else {
                                            Prestataire.findOne({email: email.toLowerCase()}, async (err, user) => {
                                                if (err)
                                                    res.status(400).send({success: false, message: err});
                                                else if (user) {
                                                    if (!bcrypt.compareSync(password, user.password))
                                                        res.status(403).send({success: false, message: "mot de passe incorrect"});
                                                    else
                                                        next()
                                                } else {
                                                    Gestionnaire.findOne({email: email.toLowerCase()}, async (err, user) => {
                                                        if (err)
                                                            res.status(400).send({success: false, message: err});
                                                        else if (user) {
                                                            if (!bcrypt.compareSync(password, user.password))
                                                                res.status(403).send({success: false, message: "mot de passe incorrect"});
                                                            else
                                                                next()
                                                        } else {
                                                            res.status(404).send({success: false, message: 'utilisateur introuvable'});
                                                        }
                                                    });
                                                }
                                            })
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

const storageDevisFacture = multer.diskStorage({
    limits: { fieldSize: 25 * 1024 * 1024 },
    destination: (req, file, cb) => {
        cb(null, './src/uploads/devis');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + file.mimetype.substr(6, file.mimetype.length))
    }
});
let uploadDevisFacture = multer({ storageDevisFacture }).single('data');


const identityCheck = (_id, userType, callBack, extraQuery, res) => {
    userType.findOne({ _id, ...extraQuery}, function (err, user) {
        if (err)
            res.status(400).send({success: false, message: "erreur system", err});
        else if (!user)
            res.status(401).send({success: false, message: 'accès refusé'});
        else
            callBack()
    })
};

const pushNotifTo = (req, targetId, message, title) => {
    let io = req.app.get('socketio');
    for (let [nb, activity] of io.sockets.sockets) {
        if (activity?.authenticatedUser?.id === targetId) {
            io.to(activity.id).emit('notify', {
                message,
                title,
                user: activity?.authenticatedUser?.id,
            });
        }
    }
};

const notify = (req, receiver_id, emitter_id, message, title, url) => {
    const notif = new Notifications({
        date_seen: null,
        date_create: new Date(),
        title,
        message,
        url,
        receiver_id,
        emitter_id,
    })
    notif.save(function(err) {
        if (err) {
            return ({success: false, message: 'Erreur lors de la création de la notification', err});
        } else {
            return ({success: true, message: 'La notification a bien été créé'});
        }
    })
}

module.exports = {
    checkEmailExist,
    checkEmailBeforeUpdate,
    uploadFile,
    checkPassword,
    identityCheck,
    uploadDevisFacture,
    pushNotifTo,
    notify,
};

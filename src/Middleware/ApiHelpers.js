/************************/
/* import local modules */
/************************/
const   Admin           = require('../MongoSchemes/admins'),
        Syndic          = require('../MongoSchemes/syndics'),
        Courtier        = require('../MongoSchemes/courtiers'),
        Architecte      = require('../MongoSchemes/architectes'),
        PresidentCS     = require('../MongoSchemes/presidentCS'),
        Prestataire     = require('../MongoSchemes/prestataires'),
        Gestionnaire    = require('../MongoSchemes/gestionnaires');
/************************/
/* import external modules */
/************************/

const   crypto = require('crypto')
const   fs = require('fs');
/************************/

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
module.exports = {
    checkEmailExist,
    uploadFile,
    identityCheck,
};

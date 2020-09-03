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

module.exports = {
    checkEmailExist
};

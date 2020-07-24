/****************************************/
/*** import modules from node_modules ***/
/****************************************/

let bcrypt  = require('bcryptjs');
let multer  = require('multer');
let path    = require("path")

/***************/
/*** helpers ***/
/***************/

const {sendCredentials} = require('../Config/mailer');

/*** generate password ***/
function generateP() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    while (pass.length <= 15) {
        let char = Math.floor(Math.random() * str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
}

/**** slat to crypt password ****/
let salt = bcrypt.genSaltSync(10);


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

const   Devis   = require('../MongoSchemes/devis');

/************/
/* Function */
/************/

/* register new syndic */

let registerSyndic = async (req, res) => {
    const {email} = req.body;
    if (req.user.role !== 'admin') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        Syndic.findOne({email}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user)
                res.status(403).send({success: false, message: 'email déjà utilisé'});
            else {
                let password = await generateP();
                let syndic = new Syndic({
                    email       	: req.body.email.toLowerCase(),
                    firstName   	: req.body.firstName,
                    lastName    	: req.body.lastName,
                    password    	: bcrypt.hashSync(password, salt),
                    company         : req.body.company,
                    siren           : req.body.siren,
                    address         : req.body.address,
                    codePostal      : req.body.codePostal,
                    ville           : req.body.ville,
                    phone           : req.body.phone,
                    parc            : [],
                    enCoursSelect   : [],
                    role        	: 'syndic'
                })
                syndic.save(function(err) {
                    if (err) {
                        res.status(400).send({ success: false, message: 'Erreur lors de la création du Syndic', err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.status(200).send({ success: true, message : 'Le Syndic a bien été crée'});
                    }
                });
            }
        })
    }
}

/* register new courtier */

let registerCourtier = async (req, res) => {
    const {email} = req.body;
    if (req.user.role !== 'admin') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        Courtier.findOne({email}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user)
                res.status(403).send({success: false, message: 'email déjà utilisé'});
            else {
                let password = await generateP();
                let courtier = new Courtier({
                    email       	: req.body.email.toLowerCase(),
                    firstName   	: req.body.firstName,
                    lastName    	: req.body.lastName,
                    password    	: bcrypt.hashSync(password, salt),
                    phone           : req.body.phone,
                    company         : req.body.company,
                    role        	: 'courtier'
                })
                courtier.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: 'Erreur lors de la création du Courtier', err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({ success: true, message : 'Le Courtier a bien été crée'});
                    }
                });
            }
        })
    }
}

/* register new architecte */

let registerArchitecte = async (req, res) => {
    const {email} = req.body;
    if (req.user.role !== 'admin') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Architecte.findOne({email}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user)
                res.status(403).send({success: false, message: 'email déjà utilisé'});
            else {
                let password = await generateP();
                let architecte = new Architecte({
                    email       	: req.body.email.toLowerCase(),
                    civility        : req.body.civility,
                    firstName   	: req.body.firstName,
                    lastName    	: req.body.lastName,
                    password    	: bcrypt.hashSync(password, salt),
                    phone           : req.body.phone,
                    nomCabinet      : req.body.nomCabinet,
                    siren           : req.body.siren,
                    address         : req.body.address,
                    codePostal      : req.body.codePostal,
                    ville           : req.body.ville,
                    role        	: 'architecte'
                })
                architecte.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création de L'Architecte", err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({ success: true, message : "L'Architecte a bien été crée"});
                    }
                });
            }
        })
    }
}

/* register new president conseil syndical */

let registerPresidentCS = async (req, res) => {
    const {email} = req.body;
    if (req.user.role !== 'admin') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        PresidentCS.findOne({email}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user)
                res.status(403).send({success: false, message: 'email déjà utilisé'});
            else {
                let password = await generateP();
                let pcs = new PresidentCS({
                    email       	: req.body.email.toLowerCase(),
                    firstName   	: req.body.firstName,
                    lastName    	: req.body.lastName,
                    password    	: bcrypt.hashSync(password, salt),
                    phone           : req.body.phone,
                    BatimentId      : req.body.BatimentId,
                    permissions     : {label: 'Lecture seule', value: 0},
                    role        	: 'pcs'
                })
                pcs.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création du PCS", err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({ success: true, message : "Le PCS a bien été crée"});
                    }
                });
            }
        })
    }
}

/* register new prestataire */

let registerPrestataire = async (req, res) => {
    const {email} = req.body;
    if (req.user.role !== 'admin') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Prestataire.findOne({email}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user)
                res.status(403).send({success: false, message: 'email déjà utilisé'});
            else {
                let password = await generateP();
                let prestataire = new Prestataire({
                    email       	    : req.body.email.toLowerCase(),
                    password    	    : bcrypt.hashSync(password, salt),
                    company             : req.body.company,
                    address             : req.body.address,
                    codePostal          : req.body.codePostal,
                    ville               : req.body.ville,
                    phone               : req.body.phone,
                    nbSalaries          : req.body.nbSalaries,
                    siret               : req.body.siret,
                    caisse              : 0,
                    representant        : {
                        civility        : req.body.civility,
                        firstName   	: req.body.firstName,
                        lastName    	: req.body.lastName,
                        phone           : req.body.phone,
                        email           : req.body.email.toLowerCase(),
                    },
                    corpsEtat           : req.body.corpsEtat,
                    RCProfessionnelle   : req.body.RCProfessionnelle,
                    RCDecennale         : req.body.RCDecennale,
                    role        	    : 'prestataire'
                })
                prestataire.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création du Prestataire", err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({ success: true, message : "Le Prestataire a bien été crée"});
                    }
                });
            }
        })
    }
}

/* upload RCProfessionnelle & RCDecennale */
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "uploads/RC-files")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + file.mimetype.substr(6, file.mimetype.length))
    }
})

const maxSize = 5 * 1000 * 1000;

let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
        // Set the filetypes, it is optional
        let filetypes = /jpeg|jpg|png|pdf|JPEG|JPG|PNG|PDF/;
        let mimetype = filetypes.test(file.mimetype);

        let extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

// file is the name of file attribute
}).single("file");

let uploadRCProfessionnelle = (req, res) => {
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req, res, function(err) {
        if(err) {
            // ERROR occured (here it can be occured due
            // to uploading file of size greater than
            // 5MB or uploading different file type)
            res.status(400).send({success: false, message: err})
        } else {
            // SUCCESS, file successfully uploaded
            res.status(200).send({success: true, message:"RCProfessionnelle uploadé!", RCProfessionnelle: req.file.filename})
        }
    })
}

let uploadRCDecennale = (req, res) => {
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req, res, function(err) {
        if(err) {
            // ERROR occured (here it can be occured due
            // to uploading file of size greater than
            // 5MB or uploading different file type)
            res.status(400).send({success: false, message: err})
        } else {
            // SUCCESS, file successfully uploaded
            res.status(200).send({success: true, message:"RCDecennale uploadé!", RCDecennale: req.file.filename})
        }
    })
}

/* register new gestionnaire */

let registerGestionnaire = async (req, res) => {
    const {email} = req.body;
    if (req.user.role !== 'admin' ||  req.user.role !== 'syndic') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Gestionnaire.findOne({email}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user)
                res.status(403).send({success: false, message: 'email déjà utilisé'});
            else {
                let password = await generateP();
                let gestionnaire = new Gestionnaire({
                        email       	: req.body.email.toLowerCase(),
                        civility        : req.body.civility,
                        firstName   	: req.body.firstName,
                        lastName    	: req.body.lastName,
                        password    	: bcrypt.hashSync(password, salt),
                        companyId       : req.body.companyId,
                        phone           : req.body.phone,
                        parc            : req.body.parc,
                        enCoursSelect   : req.body.enCoursSelect,
                        permissions     : req.body.permissions,
                        role        	: 'gestionnaire'
                })
                gestionnaire.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création du Gestionnaire", err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({ success: true, message : "Le Gestionnaire a bien été crée"});
                    }
                });
            }
        })
    }
}

/* register new Copro without batiment */

let registerCopro = (req, res) => {
    const {name, codePostal, ville} = req.body;
    if (req.user.role !== 'gestionnaire' || req.user.role !== 'syndic') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Copro.findOne({$and: [{name}, {codePostal}, {ville}]}, async (err, copro) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (copro)
                res.status(403).send({success: false, message: 'La Copro existe déjà'});
            else {

                let copro = new Copro({
                    name       	    : req.body.name,
                    reference       : req.body.reference,
                    address    	    : req.body.address,
                    codePostal      : req.body.codePostal,
                    ville    	    : req.body.ville,
                    syndic          : req.body.syndic
                })
                copro.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création de la Copro", err});
                    } else {
                        res.send({ success: true, message : "La Copro a bien été créée"});
                    }
                });
            }
        })
    }
}

/* register new Batiment */

let registerBatiment = async (req, res) => {
    const {batiment} = req.body.batiments;
    if (req.user.role !== 'gestionnaire' || req.user.role !== 'syndic') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        Batiment.findOne({$and: [{reference: batiment.reference}, {copro: batiment.copro}]}, async (err, Batiment) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (copro)
                res.status(403).send({success: false, message: 'Le batiment existe déjà'});
            else {
                let bat = new Batiment(batiment)
                bat.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création du Batiment", err});
                    } else {
                        res.send({ success: true, message : "Le Batiment a bien été créée"});
                    }
                });
            }
        })
    }
}

/* register new Devis */

let registerDevis = async (req, res) => {
    const {name, codePostal, ville, copro} = req.body;
    if (req.user.role !== 'admin' || req.user.role !== 'syndic') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Devis.findOne({$and: [{copro}, {prestataire}, {syndic}, {copro}]}, async (err, Batiment) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (copro)
                res.status(403).send({success: false, message: 'Un devis a déjà été crée'});
            else {
                let devis = new Devis({
                    reference       : req.body.reference,
                    descriptif      : req.body.descriptif,
                    naturetravaux   : req.body.naturetravaux,
                    support         : req.body.support,
                    hauteur         : req.body.hauteur,
                    couleur         : req.body.couleur,
                    photos          : req.body.photos,
                    evaluationTTC   : req.body.evaluationTTC,
                    copro    	    : req.body.copro,
                    Batiment        : req.body.Batiment,
                    prestataire     : req.body.prestataire,
                    syndic          : req.body.syndic,
                    gestionnaire    : req.body.gestionnaire,
                    pcs             : req.body.pcs,
                })
                devis.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création du Devis", err});
                    } else {
                        res.send({ success: true, message : "Le Devis a bien été crée"});
                    }
                });
            }
        })
    }
}

/* Export Functions */

module.exports = {
    registerSyndic,
    registerCourtier,
    registerArchitecte,
    registerPresidentCS,
    registerPrestataire,
    uploadRCProfessionnelle,
    uploadRCDecennale,
    registerGestionnaire,
    registerCopro,
    registerBatiment,
    registerDevis
}
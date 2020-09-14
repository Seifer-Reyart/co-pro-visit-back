/****************************************/
/*** import modules from node_modules ***/
/****************************************/

let bcrypt  = require('bcryptjs');
let multer  = require('multer');
let path    = require("path");
let xlsx    = require('node-xlsx').default;
let fs      = require('fs');
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

const   Devis    = require('../MongoSchemes/devis');
const   Visite   = require('../MongoSchemes/visites');
const   Incident = require('../MongoSchemes/incidents');


/************/
/* Function */
/************/

/* register new syndic */

let registerSyndic = async (req, res) => {
    const {email, siren} = req.body;
    if (req.user.role !== 'admin') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        Syndic.findOne({$or: [{email: email.toLowerCase()},{siren}]}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user) {
                if (user.email === email.toLowerCase())
                    res.status(403).send({success: false, message: 'email déjà utilisé'});
                else if (user.siren === siren)
                    res.status(403).send({success: false, message: 'siren déjà utilisé'});
            } else {
                let password = await generateP();
                let syndic = new Syndic({
                    email       	: req.body.email.toLowerCase(),
                    firstName   	: req.body.firstName,
                    lastName    	: req.body.lastName,
                    password    	: bcrypt.hashSync(password, salt),
                    nomSyndic       : req.body.company,
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
                        res.status(200).send({ success: true, message : 'Le Syndic a bien été créé'});
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
        Courtier.findOne({email: email.toLowerCase()}, async (err, user) => {
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
                        res.send({ success: true, message : 'Le Courtier a bien été créé'});
                    }
                });
            }
        })
    }
}

/* register new architecte */

let registerArchitecte = async (req, res) => {
console.log("create architecte")
    const {email, siren} = req.body;
    if (req.user.role !== 'admin') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Architecte.findOne({$or: [{email: email.toLowerCase()},{siren}]}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user) {
                if (user.email === email.toLowerCase())
                    res.status(403).send({success: false, message: 'email déjà utilisé'});
                else if (user.siren === siren)
                    res.status(403).send({success: false, message: 'siren déjà utilisé'});
            } else {
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
                    zoneInter       : req.body.zoneInter,
                    role        	: 'architecte'
                })
                architecte.save(function(err) {
                    if (err) {
                        console.log(err)
                        res.send({ success: false, message: "Erreur lors de la création de L'Architecte", err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({ success: true, message : "L'Architecte a bien été créé"});
                    }
                });
            }
        })
    }
}

/* register new president conseil syndical */

let registerPresidentCS = async (req, res) => {
    const {email} = req.body;
    if (req.user.role !== 'admin' && req.user.role !== 'syndic' && req.user.role !== 'gestionnaire') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        PresidentCS.findOne({email: email.toLowerCase()}, async (err, user) => {
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
                        res.send({ success: true, message : "Le PCS a bien été créé"});
                    }
                });
            }
        })
    }
}

/* register new prestataire */

let registerPrestataire = async (req, res) => {
    const {email, siret} = req.body;
    if (req.user.role !== 'admin') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        Prestataire.findOne({$or: [{email: email.toLowerCase()}, {siret}]}, async (err, user) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (user) {
                if (user.email === email.toLowerCase())
                    res.status(403).send({success: false, message: 'email déjà utilisé'});
                else if (user.siret === siret)
                    res.status(403).send({success: false, message: 'siret déjà utilisé'});
            } else {
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
                        res.send({ success: true, message : "Le Prestataire a bien été créé"});
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
        cb(null, "./src/uploads/RC-files")
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + "-" + file.originalname)
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

        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }

// data is the name of file attribute sent in body
}).single("data");

let uploadRCProfessionnelle = (req, res) => {
    if (req.user.role !== 'prestataire') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else
        // Error MiddleWare for multer file upload, so if any
        // error occurs, the file would not be uploaded!
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
    if (req.user.role !== 'prestataire') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else
        // Error MiddleWare for multer file upload, so if any
        // error occurs, the file would not be uploaded!
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
    if (req.user.role !== 'syndic') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Gestionnaire.findOne({email: email.toLowerCase()}, async (err, user) => {
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
                        syndic          : req.body.syndic,
                        phone           : req.body.phone,
                        parc            : req.body.parc && req.body.parc.length > 0 ? req.body.parc : [],
                        enCoursSelect   : req.body.enCoursSelect && req.body.enCoursSelect.length > 0 ? req.body.enCoursSelect : [],
                        permissions     : req.body.permissions,
                        role        	: 'gestionnaire'
                })
                gestionnaire.save(function(err, gest) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création du Gestionnaire", err});
                    } else {
                        Syndic.updateOne({_id: req.body.syndic}, {$push: {gestionnaires: gest._id}}, (err) => {
                            if (err)
                                res.send({ success: false, message: "Erreur lors de l'ajout du Gestionnaire au Syndic", err});
                            else {
                                sendCredentials(req.body.email.toLowerCase(), password);
                                res.send({ success: true, message : "Le Gestionnaire a bien été créé"});
                            }
                        })
                    }
                });
            }
        })
    }
}

/* register new Copro without batiment */

let registerCopro = (req, res) => {
    const {name, codePostal, ville} = req.body;
    if (req.user.role !== 'gestionnaire' && req.user.role !== 'syndic') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Copro.findOne({$and: [{name}, {codePostal}, {ville}]}, async (err, copro) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (copro)
                res.status(403).send({success: false, message: 'La Copro existe déjà'});
            else {
                let copro = new Copro({
                    nomCopro       	: req.body.nomCopro,
                    reference       : req.body.reference,
                    address    	    : req.body.address,
                    codePostal      : req.body.codePostal,
                    ville    	    : req.body.ville,
                    nbBatiments     : req.body.nbBatiments,
                    surface         : req.body.surface,
                    nbrLot          : req.body.nbrLot,
                    multiDevis      : req.body.multiDevis,
                    maxTravaux      : req.body.maxTravaux,
                    syndicNominated : req.body.syndicNominated ? req.body.syndicNominated : null,
                    syndicEnCours   : req.body.syndicEnCours ? req.body.syndicEnCours : null
                })
                copro.save(async function(err, cpr) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création de la Copro", err});
                    } else {
                        if (req.body.syndicNominated)
                            await Syndic.updateOne({_id: req.body.syndicNominated}, {$push: {parc: cpr._id}});
                        else
                            await Syndic.updateOne({_id: req.body.syndicEnCours}, {$push: {enCoursSelect: cpr._id}});
                        res.send({ success: true, message : "La Copro a bien été créée"});
                    }
                });
            }
        })
    }
}

/* upload an xls/xlsx file of copros, parse it and store elements in DB */
/* upload RCProfessionnelle & RCDecennale */
let storageXls = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "./src/uploads/copros-xls")
    },
    filename: function (req, file, cb) {
        cb(null, req.user + "-" + file.originalname);
    }
})

let uploadXls = multer({
    storage: storageXls,
    fileFilter: function (req, file, cb){
        // Set the filetypes, it is optional
        let filetypes = /vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|/;
        let exttypes = /xls|xlsx/
        let mimetype = filetypes.test(file.mimetype);
        let extname = exttypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: Assurez vous de transmettre un fichier excel - " + exttypes);
    }

// data is the name of file attribute sent in body
}).single("data");

let parseXlsThenStore = (req, res) => {
    if (req.user.role !== 'syndic') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        // Error MiddleWare for multer file upload, so if any
        // error occurs, the file would not be uploaded!
        uploadXls(req, res, async function (err) {
            if (err) {
                // ERROR occured
                res.status(400).send({success: false, message: err})
            } else {
                // SUCCESS, file successfully uploaded
                let obj = await xlsx.parse('./src/uploads/copros-xls/' + req.file.filename);
                let error = {
                    isError: false,
                    message: "",
                    errors: []
                };
                obj[0].data.map((item, index) => {
                    if (index >= 1) {
                        if (item[0] && item[2] && item[3] && item[4] && item[5]) {
                            let copro = new Copro({
                                name: item[1],
                                reference: item[0],
                                address: item[2],
                                codePostal: item[3],
                                ville: item[4],
                                surface: item[5],
                                compagnie: {
                                    assurance: item[6],
                                    echeance: null
                                },
                                syndicEnCours: req.user.id
                            })
                            copro.save(function (err) {
                                if (err) {
                                    error.isError = true;
                                    error.message = err;
                                    error.errors.push(item)
                                }
                            });
                        }
                    }
                });
                res.status(200).send({success: true, message: "La liste de Copros a bien été créée", error});
            }
        })
    }
}

/* register new Batiment */

let saveBatiment = (batiment, index, id) => {
    return new Promise(resolve => {
        Batiment.findOne({$and: [{reference: batiment.reference}, {coproId: batiment.coproId}]}, async (err, Bat) => {
            if (err) {
                console.log('save err: ', err)
                resolve({success: false, message: err});
            } else if (Bat) {
                console.log('batiment: ', Bat)
                resolve({success: false, message: 'Le batiment existe déjà - reference: ' + Bat.reference});
            } else {
                batiment.faitLe = new Date();
                batiment.reference = 'bat-'+index+'-'+id;
                let bat = new Batiment(batiment);
                bat.save(function(err, b) {
                    if (err) {
                        console.log('err mongo save: ', err);
                        resolve({ success: false, message: "Erreur lors de la création du Batiment "+bat.reference, err});
                    } else {
                        console.log('mongo save ok!!: '+b._id);
                        resolve({success: true, _id: b._id});
                    }
                });
            }
        })
    })
}

let registerBatiment = async (req, res) => {
    const {batiments, coproId} = req.body;
    console.log("body: ", req.body);
    if (req.user.role !== 'admin' && req.user.role !== 'architecte') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        let succeded = [];
        let failed = [];
        let promises = null;
        promises = await batiments.map((batiment, index) => {
            return new Promise(async resolve => {
                let resp = await saveBatiment(batiment, index, coproId);
                if (resp.success) {
                    succeded.push(resp._id);
                    resolve();
                } else {
                    failed.push(resp);
                    resolve();
                }
            })
        });
        await Promise.all(promises);
        if (failed.length > 0) {
            await Batiment.deleteMany({_id: {$in: succeded}}, function (err) {
                if (err)
                    console.log('err delete: ', err)
            });
            res.status(400).send({success: false, message: "l'enregistrement a échoué, des erreurs requièrent votre attention!!!", failed});
        } else {
            await Copro.findOneAndUpdate(
                {_id: coproId},
                {$set: {batiments: succeded, dateVisite: new Date()}},
                {new: true},
                function (err) {
                    if (err)
                        console.log(err)
                });
            await Visite.findOneAndUpdate({coproId}, {$set: {faiteLe: new Date(), done: true}}, {new: false}, function (err) {
                if (err) {
                    failed.push({err})
                    console.log('update err: ', err)
                }
            });
            res.status(200).send({success: true, message: "fiche(s) enregistrée(s)"});
        }
    }
}

/* register new Devis */

let registerDevis = async (req, res) => {
    const {name, codePostal, ville, copro} = req.body;
    if (req.user.role !== 'admin' && req.user.role !== 'prestataire') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Devis.findOne({$and: [{copro}, {prestataire}, {syndic}]}, async (err, Devis) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (Devis)
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
                        res.send({ success: true, message : "Le Devis a bien été créé"});
                    }
                });
            }
        })
    }
}

/* register new Incident */

let registerIncident = async (req, res) => {
    if (req.user.role !== 'architecte' && req.user.role !== 'admin') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        const { courtierId, architecteId, gestionnaireId, visiteId, syndicId, coproId, metrages, desordre, situation, description, corpsEtat} = req.body;
        Copro.findOne({_id: coproId}, async (err, copr) => {
            if (err) {
                res.status(400).send({ success: false, message: "Erreur lors de l'identification de la copropriété", err});
            } else if (!copr) {
                res.status(404).send({ success: false, message: "copropriété non identifée"});
            } else {
                let imagesUploadErrors = [];
                let imagesUploaded = []
                let promisesFiles = null;
                if (req.files) {
                    promisesFiles = req.files.map( file => {
                        return new Promise((resolve) => {
                            let filetypes = /jpeg|jpg|png|pdf|JPEG|JPG|PNG|PDF/;
                            let mimetype = filetypes.test(file.mimetype);
                            if (mimetype) {
                                fs.writeFile('./src/uploads/incidents/' + file.originalname, file.buffer, (err) => {
                                    if (err) {
                                        imagesUploadErrors.push({imageTitle: file.originalname, err});
                                        resolve()
                                    }
                                    else {
                                        imagesUploaded.push(file.originalname);
                                        resolve()
                                    }
                                })
                            } else {
                                imagesUploadErrors.push({
                                    imageTitle: file.originalname,
                                    err: "Mauvais format, reçu " + file.mimetype + ", attendu: " + filetypes
                                });
                                resolve()
                            }
                        })
                    });
                    await Promise.all(promisesFiles)
                }
                let incident = new Incident({
                    images: imagesUploaded  ,
                    date: new Date()        ,
                    metrages                ,
                    desordre                ,
                    situation               ,
                    description             ,
                    corpsEtat               ,
                    courtierId              ,
                    gestionnaireId          ,
                    architecteId            ,
                    visiteId                ,
                    syndicId                ,
                    coproId                 ,
                });
                incident.save(function(err, incid) {
                    if (err) {
                        res.status(400).send({ success: false, message: "Erreur lors de la création de l'Incident", err});
                    } else {
                        Copro.findOneAndUpdate({_id: coproId}, {$push: {incidentId: incid._id}}, {new: true}, function (err, court) {
                            console.log('Copro.findOneAndUpdate err', err);
                            if (err || !court)
                                res.status(400).send({success: false, message: "Erreur lors de la mise à jour de la copropriété associée", err});
                            else {
                                Prestataire.updateMany({
                                    $and: [
                                        {corpsEtat: {$elemMatch: {$eq: corpsEtat}}},
                                        {syndics: {$elemMatch: {$eq: copr.syndicNominated}}}
                                        ]
                                }, {$push: {incidentId: incid._id}}, {new: true}, function (err, prest) {
                                    if (err)
                                        res.status(400).send({success: false, message: "Erreur lors de la mise à jour de la liste des prestataires", err});
                                    else
                                        res.status(200).send({
                                            success: true,
                                            message: "L'incident a bien été créé",
                                            imagesUploadErrors,
                                            incident
                                        });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

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
    registerDevis,
    registerIncident,
    parseXlsThenStore,
};

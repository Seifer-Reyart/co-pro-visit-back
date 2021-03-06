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
const { uploadFile, identityCheck }    = require('../Middleware/ApiHelpers');
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

/**** salt to crypt password ****/
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
                const imageUploaded = uploadFile(req.files.image, './src/uploads/syndic/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;

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
                    image           : imageUploadError.length === 0 && imageUploaded.length ? image[0] : null,
                    parc            : [],
                    enCoursSelect   : [],
                    role        	: 'syndic'
                })
                syndic.save(function(err) {
                    if (err) {
                        res.status(400).send({ success: false, message: 'Erreur lors de la création du Syndic', err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.status(200).send({
                            success: true,
                            message : 'Le Syndic a bien été créé',
                            image,
                            imageUploadError,
                        });
                    }
                });
            }
        })
    }
} // Testag

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
                const imageUploaded = uploadFile(req.files.image, './src/uploads/courtier/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;
                    let courtier = new Courtier({
                    email       	: req.body.email.toLowerCase(),
                    firstName   	: req.body.firstName,
                    lastName    	: req.body.lastName,
                    password    	: bcrypt.hashSync(password, salt),
                    phone           : req.body.phone,
                    image           : imageUploadError.length === 0 && imageUploaded.length ? image[0] : null,
                    company         : req.body.company,
                    role        	: 'courtier'
                })
                courtier.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: 'Erreur lors de la création du Courtier', err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({
                            success: true,
                            message : 'Le Courtier a bien été créé',
                            image,
                            imageUploadError,
                        });
                    }
                });
            }
        })
    }
} //Testag

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
                const imageUploaded = uploadFile(req.files.image, './src/uploads/architecte/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;
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
                    image           : imageUploadError.length === 0 && imageUploaded.length ? image[0] : null,
                    role        	: 'architecte'
                })
                architecte.save(function(err) {
                    if (err) {
                        console.log(err)
                        res.send({ success: false, message: "Erreur lors de la création de L'Architecte", err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({ success: true, message : "L'Architecte a bien été créé", image, imageUploadError});
                    }
                });
            }
        })
    }
} /// TESTAG

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
                const imageUploaded = uploadFile(req.files.image, './src/uploads/presidentCS/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;
                let pcs = new PresidentCS({
                    email       	: req.body.email.toLowerCase(),
                    firstName   	: req.body.firstName,
                    lastName    	: req.body.lastName,
                    password    	: bcrypt.hashSync(password, salt),
                    phone           : req.body.phone,
                    image           : imageUploadError.length === 0 && imageUploaded.length ? image[0] : null,
                    BatimentId      : req.body.BatimentId,
                    permissions     : {label: 'Lecture seule', value: 0},
                    role        	: 'pcs'
                })
                pcs.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: "Erreur lors de la création du PCS", err});
                    } else {
                        sendCredentials(req.body.email.toLowerCase(), password);
                        res.send({
                            success: true,
                            message : "Le PCS a bien été créé",
                            image,
                            imageUploadError,
                        });
                    }
                });
            }
        })
    }
} // Testag

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
                const imageUploaded = uploadFile(req.files.image, './src/uploads/prestataire/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;

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
                    image               : imageUploadError.length === 0 && imageUploaded.length ? image[0] : null,
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
                        res.send({
                            success: true,
                            message : "Le Prestataire a bien été créé",
                            image,
                            imageUploadError
                        });
                    }
                });
            }
        })
    }
} //Testag

/* upload RCProfessionnelle & RCDecennale */
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "./src/uploads/RC-files")
    },
    filename: async function (req, file, cb) {
        let name = await generateP();
        cb(null, req.user.id + "-" + name)
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
                res.status(400).send({success: false, message: err});
            } else {
                // SUCCESS, file successfully uploaded
                Prestataire.findOneAndUpdate(
                    {_id: req.user.id},
                    {$set: {RCProfessionnelle: '/uploads/RC-files/'+req.file.filename}},
                    {new: false},
                    function (err) {
                        if (err)
                            res.status(400).send({success: false, message: err})
                        else
                            res.status(200).send({success: true, message:"RCProfessionnelle uploadé!", RCProfessionnelle: req.file.filename})
                    })
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
                // SUCCESS, file successfully uploaded
                Prestataire.findOneAndUpdate(
                    {_id: req.user.id},
                    {$set: {RCDecennale: '/uploads/RC-files/'+req.file.filename}},
                    {new: false},
                    function (err) {
                        if (err)
                            res.status(400).send({success: false, message: err})
                        else
                            res.status(200).send({success: true, message:"RCDecennale uploadé!", RCDecennale: req.file.filename});
                    })

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
                const imageUploaded = uploadFile(req.files.image, './src/uploads/gestionnaire/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;

                let gestionnaire = new Gestionnaire({
                        email       	: req.body.email.toLowerCase(),
                        civility        : req.body.civility,
                        firstName   	: req.body.firstName,
                        lastName    	: req.body.lastName,
                        password    	: bcrypt.hashSync(password, salt),
                        syndic          : req.body.syndic,
                        phone           : req.body.phone,
                        image           : imageUploadError.length === 0 && imageUploaded.length ? image[0] : null,
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
                                res.send({
                                    success: true,
                                    message : "Le Gestionnaire a bien été créé",
                                    image,
                                    imageUploadError,
                                });
                            }
                        })
                    }
                });
            }
        })
    }
} // Testagg

/* register new Copro without batiment */

let registerCopro = (req, res) => {
    const {nomCopro, codePostal, ville} = req.body;
    if (req.user.role !== 'gestionnaire' && req.user.role !== 'syndic' && req.user.role !== 'admin') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Copro.findOne({$and: [{nomCopro}, {codePostal}, {ville}]}, async (err, copro) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (copro)
                res.status(403).send({success: false, message: 'La Copro existe déjà'});
            else {
                const imageUploaded = uploadFile(req.files.image, './src/uploads/copro-img/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;

                let copro = new Copro({
                    nomCopro       	: req.body.nomCopro,
                    reference       : req.body.reference,
                    address    	    : req.body.address,
                    codePostal      : req.body.codePostal,
                    ville    	    : req.body.ville,
                    image           : imageUploadError.length === 0 && imageUploaded.length ? image[0] : null,
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
                        res.send({
                            success: true,
                            message : "La Copro a bien été créée",
                            image,
                            imageUploadError,
                        });
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

/* upload batiment images */

let uploadBatImage = async (req, res) => {
    if (req.user.role !== 'architecte' && req.user.role !== 'admin') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        const userId = req.user.id;
        const { coproId } = req.body;
        Copro.findOne({_id: coproId}, (err, copr) => {
            console.log('Copro.findOne', err , !copr)
            if (err)
                res.status(400).send({success: false, message: 'Erreur système', err});
            else if (!copr)
                res.status(404).send({success: false, message: 'Pas de copropriété associée'});
            else {
                Architecte.findOne({_id: userId, copros: {$elemMatch: {$eq: copr._id}} }, async (err, archi) => {
                    console.log('Architecte.findOne', err , !archi)
                    if (err)
                        res.status(400).send({success: false, message: 'Erreur système', err});
                    else if (!archi)
                        res.status(401).send({success: false, message: 'Accès refusé'});
                    else {
                        const imageUploaded = uploadFile(req.files.image, './src/uploads/batiment/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                        const resolvedPhotosUpload = imageUploaded ? await Promise.all(imageUploaded) : null;
                        const image = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;
                        const imageUploadError = resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null;
                        if (imageUploadError.length > 0 || !image.length)
                            res.status(424).send({success: false, imageUploadError: imageUploadError[0]})
                        else {
                            Copro.findOneAndUpdate({_id: copr._id}, {$push: {assignableImage: image[0]}}, (err, copro) => {
                                console.log('Copro.findOneAndUpdate', err , copro)
                                console.log('Copro.findOneAndUpdate image', image)
                                if (err)
                                    res.status(400).send({success: false, message: 'Erreur système', err});
                                else if (!copro)
                                    res.status(404).send({success: false, message: 'Pas de copropriété associée'});
                                else
                                    res.status(200).send({success: true, image: image[0]})
                            })
                        }

                    }
                })
            }
        })
    }
}
/* register new Batiment */

let saveBatiment = async (batiment, index, id, images) => {
    return new Promise(async (resolve) => {
        batiment.reference = 'bat-'+index+'-'+id;
        batiment.coproId = id;
        Batiment.findOne({$and: [{reference: batiment.reference}, {coproId: batiment.coproId}]}, async (err, Bat) => {
            if (err) {
                console.log('save err: ', err)
                resolve({success: false, message: err});
            } else if (Bat) {
                console.log('batiment: ', Bat)
                resolve({success: false, message: 'Le batiment existe déjà - reference: ' + Bat.reference});
            } else {
                batiment.faitLe = new Date();
                const imageFormatted = batiment.image;
                const batImages = {
                    ParcelleCadastrale : images.find(e => e === imageFormatted.ParcelleCadastrale) ? images.find(e => e === imageFormatted.ParcelleCadastrale) : null,
                    VueGenGoogle       : images.find(e => e === imageFormatted.VueGenGoogle) ? images.find(e => e === imageFormatted.VueGenGoogle) : null,
                    facadeRue          : images?.filter(e => imageFormatted.facadeRue?.find(img => img === e)) ?? [],
                    facadeArriere      : images?.filter(e => imageFormatted.facadeArriere?.find(img => img === e)) ?? [],
                    entrees            : images?.filter(e => imageFormatted.entrees?.find(img => img === e)) ?? [],
                    etages             : images?.filter(e => imageFormatted.etages?.find(img => img === e)) ?? [],
                    caves              : images?.filter(e => imageFormatted.caves?.find(img => img === e)) ?? [],
                    parking            : images?.filter(e => imageFormatted.parking?.find(img => img === e)) ?? [],
                    environnement      : images?.filter(e => imageFormatted.environnement?.find(img => img === e)) ?? [],
                    contiguite         : images?.filter(e => imageFormatted.contiguite?.find(img => img === e)) ?? [],
                };
                let toBeRemoved = [];
                console.log(batImages)
                for (prop in batImages) {
                    if (prop !== "ParcelleCadastrale" && prop !== "VueGenGoogle")
                        toBeRemoved = toBeRemoved.concat(batImages[prop]);
                    else
                        toBeRemoved.push(batImages[prop]);
                }
                Copro.findOneAndUpdate({_id: id}, {
                    assignableImage: images.filter(img => !toBeRemoved.find(im => im === img ))
                });
                batiment.image = batImages
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
        Copro.findOne({_id: coproId}, async (err, copr) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else if (!copr)
                res.status(403).send({success: false, message: 'Pas de copropriété associée'});
            else {
                let succeded = [];
                let failed = [];
                let promises = null;
                promises = await batiments.map((batiment, index) => {
                    return new Promise(async resolve => {
                        let resp = await saveBatiment(batiment, index, coproId, copr.assignableImage.filter((a, b) => copr.assignableImage.indexOf(a) === b));
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
        })

    }
}

/* register new Devis */

let registerDevis = async (req, res) => {
    const {
        name,
        codePostal,
        ville,
        reference,
        descriptif,
        naturetravaux,
        support,
        hauteur,
        couleur,
        evaluationTTC,
        coproId,
        batimentId,
        prestataireId,
        syndicId,
        pcsId
    } = req.body;
    if (req.user.role !== 'admin' && req.user.role !== 'prestataire') {
        res.status(403).send({success: false, message: 'accès interdit'});
    } else {
        Copro.findOne({_id: coproId}, async (err, searchedCopro) => {
            if (err)
                res.status(400).send({
                    success: false,
                    message: "Erreur lors de la récupération de la copropriété associée"
                })
            else if (!searchedCopro)
                res.status(404).send({ success: false, message: "La copropriété associée est introuvable" })
            else {
                Devis.findOne({$and: [{coproId}, {prestataireId}, {syndicId}]}, async (err, devisSearched) => {
                    if (err)
                        res.status(400).send({success: false, message: err});
                    else if (devisSearched)
                        res.status(403).send({success: false, message: 'Un devis a déjà été crée'});
                    else {
                        const imagesUploaded = uploadFile(req.files.photos, './src/uploads/devis/', /jpeg|jpg|png|JPEG|JPG|PNG/)
                        const documentUploaded = uploadFile(req.files.document, './src/uploads/devis/', /pdf|PDF/)
                        const resolvedDocumentUpload = documentUploaded ? await Promise.all(documentUploaded) : null;
                        const resolvedPhotosUpload = imagesUploaded ? await Promise.all(imagesUploaded) : null;
                        const document = resolvedDocumentUpload?.map(i => i.imagesUploaded).filter(im => im)[0] ?? null
                        const photos = resolvedPhotosUpload?.map(i => i.imagesUploaded).filter(im => im) ?? null;

                        let devis = new Devis({
                            /*reference,
                            descriptif,
                            naturetravaux,
                            support,
                            hauteur,
                            evaluationTTC,
                            couleur,*/
                            document,
                            photos,
                            coproId,
                            batimentId,
                            prestataireId,
                            syndicId,
                            pcsId,
                        })
                        devis.save(function (err, devisSaved) {
                            if (err) {
                                res.send({success: false, message: "Erreur lors de la création du Devis", err});
                            } else {
                                Copro.findOneAndUpdate({_id: coproId}, {$push: {devisId: devisSaved._id}},  async (err, searchedCopro) => {
                                    if (err)
                                        res.status(400).send({
                                            success: false,
                                            message: "Erreur lors de la récupération de la copropriété associée"
                                        })
                                    else if (!searchedCopro)
                                        res.status(404).send({ success: false, message: "La copropriété associée est introuvable" })
                                    else
                                        res.status(200).send({
                                            success: true,
                                            message: "Le Devis a bien été créé",
                                            document,
                                            photos,
                                            photosUploadError: resolvedPhotosUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null,
                                            documentUploadError: resolvedDocumentUpload?.map(i => i.imagesUploadErrors).filter(im => im) ?? null,

                                        });

                                })
                            }
                        });
                    }
                });
            }
        });
    }
}

/* register new Incident */

let registerIncident = async (req, res) => {
    if (req.user.role !== 'architecte' && req.user.role !== 'admin') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        const { courtierId, architecteId, gestionnaireId, visiteId, syndicId, coproId, metrages, desordre, situation, description, commentaire, corpsEtat} = req.body;
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
                    commentaire
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
    uploadBatImage,
    registerGestionnaire,
    registerCopro,
    registerBatiment,
    registerDevis,
    registerIncident,
    parseXlsThenStore,
};

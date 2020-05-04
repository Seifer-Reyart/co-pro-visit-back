let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let date = new Date();
date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now
let adminSchema = new Schema(
    {
        email: String,
        username: String,
        lastName: String,
        firstName: String,
        password: String,
        role: {
            type: String,
            default: 'admin'
        },
        tokenSession: {
            token: {type: String, default: ""},
            expire: {type: Date, default: date}
        },
        registerDate: Date,
        lastVisit: Date,
        sex: {
            type: String,
            enum: ['homme', 'femme']
        },
        phone: String,
    }
);
let admins = mongoose.model('admins', adminSchema);

let syndicSchema = new Schema({
    username: String,
    password: String,
    entreprise: {                  // the company
        raisonSociale: String,     // Company's name or legal entity
        siren: String,             // SIREN registration number
        codePostal: String,    // zipcode
        ville: String,         // city
        phone: String          // phone
    },
    representant: {         // the representative or nominee or designee or sales agent... etc
        civility: String,
        lastName: String,
        firstName: String,
        phone: String,
        email: String,
    },
    role: {
        type: String,
        default: 'syndic'
    },
});
let syndics = mongoose.model("syndics", syndicSchema);

let courtierSchema = new Schema({
    username: String,
    password: String,
    entreprise: {
        raisonSociale: String,
        siren: String,
        codePostal: String,
        ville: String,
        phone: String
    },
    representant: {         // the representative, nominee, designee, sales agent... etc
        civility: String,
        lastName: String,
        firstName: String,
        phone: String,
        email: String,
    },
    role: {
        type: String,
        default: 'courtier'
    },
});
let courtiers = mongoose.model('courtiers', courtierSchema);

let architecteSchema = new Schema({
    username: String,
    password: String,
    numeroAffiliationNationale: String,     // unique national affiliate number
    siren: String,                          // SIREN registration number
    civility: String,
    lastName: String,                       // achitector's last name
    firstName: String,                      // architector's first name
    phone: String,                          // architector's phone number
    email: String,                          // architector's email
    NomCabinet: String,                     // architectural firm name
    address: String,                        // firm's street number and name
    ville: String,                          // firm's city name
    codePostal: String,                     // firm's city zipcode
    role: {
        type: String,
        default: 'architecte'
    },
})
let architectes = mongoose.model('architectes', architecteSchema);

let prestataireSchema = new Schema({
    username: String,
    password: String,
    entreprise: {
        nom: String,                // company's name
        address: String,            // Street Number and name
        codePostal: String,         // zip code
        ville: String,              // city
        phone: String,
        email: String,
        nbSalaries: Number,         // number of workers
        siret: String               // SIRET registration number
    },
    gerant: {
        lastName: String,       // the manager
        firstName: String,
        phone: String,
        email: String,
        activities: [String]    // array of all the activities handled by
    },
    RCProfessionnelle: String,  // name of uploaded file (related to Professional Liability insurance)
    RCDecennale: String,         // name of uploaded file (related to ten-year civil liability insurance)
    role: {
        type: String,
        default: 'prestataire'
    },
});
let prestataires = mongoose.model('prestataires', prestataireSchema);

module.exports = {
    admins,
    syndics,
    courtiers,
    architectes,
    prestataires
};
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
    entreprise: {                  // the company
        raisonSociale: String,     // Company's name or legal entity
        siren: String,             // SIREN registration number
        address: {
            codePostal: String,    // zipcode
            ville: String,         // city
            phone: String          // phone
        },
    },
    representant: {         // the representative or nominee or designee or sales agent... etc
        civility: String,
        lastName: String,
        firstName: String,
        phone: String,
        email: String,
    },
});
let syndic = mongoose.model("syndics", syndicSchema);

let courtierSchema = new Schema({
    entreprise: {
        raisonSociale: String,
        siren: String,
        address: {
            codePostal: String,
            ville: String,
            phone: String
        },
    },
    representant: {         // the representative, nominee, designee, sales agent... etc
        civility: String,
        lastName: String,
        firstName: String,
        phone: String,
        email: String,
    },
});
let courtiers = mongoose.model('courtiers', courtierSchema);

let architecteSchema = new Schema({
    NumeroAffiliationNationale: String,     // unique national affiliate number
    civility: String,
    lastName: String,
    firstName: String,
    phone: String,
    email: String
})
let architectes = mongoose.model('architectes', architecteSchema);

let prestataireSchema = new Schema({
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
    RCDecennale: String         // name of uploaded file (related to ten-year civil liability insurance)
});
let prestataires = mongoose.model('prestataire', prestataireSchema);

module.exports = {
    admins,
    syndic,
    courtiers,
    architectes,
    prestataires
};
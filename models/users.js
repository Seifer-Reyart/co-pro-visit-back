let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let date = new Date();
date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now
let adminSchema = new Schema(
    {
        email: String,
        username: String,
        firstName: String,
        lastName: String,
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
        phone: {value: String, kind: String}, // phone kind can be: [Mobile, Fixe]
    }
);
let admins = mongoose.model('admins', adminSchema);

let syndicSchema = new Schema({});
let syndic = mongoose.model("syndics", syndicSchema);

let courtierSchema = new Schema({});
let courtiers = mongoose.model('courtiers', courtierSchema);

let prestataireSchema = new Schema({});
let prestataires = mongoose.model('prestataire', prestataireSchema);

module.exports = {
    admins,
    syndic,
    courtiers,
    prestataires
};
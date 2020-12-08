let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let syndicsSchema = new Schema({
    email       	: {
        type    : String,
        required: true
    },
    firstName   	: {
        type    : String,
        required: true
    },
    lastName    	: {
        type    : String,
        required: true
    },
    password    	: String,
    nomSyndic       : {
        type    : String,
        required: true
    },
    image           : {
        type    : String,
        default : null
    },
    siren           : {
        type    : String,
        required: true
    },
    address         : {
        type    : String,
        required: true
    },
    codePostal      : {
        type    : String,
        required: true
    },
    ville           : {
        type    : String,
        required: true
    },
    phone           : {
        type    : String,
        required: true
    },
    gestionnaires   : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    parc            : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    enCoursSelect   : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    courtiers       : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    prestataires    : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    createdAt       : {
        type: Date,
        default: new Date()
    },
    credit          : {
        type    : Number,
        default : 0
    },
    role        	: {
        type: String,
        default: 'syndic'
    },
});

let syndics = mongoose.model('syndics', syndicsSchema);

module.exports = syndics;

let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let architectesSchema = new Schema({
    email       	: {
        type: String,
        required: true
    },
    firstName   	: {
        type: String,
        required: true
    },
    lastName    	: {
        type: String,
        required: true
    },
    password    	: String,
    phone           : {
        type: String,
        required: true
    },
    nomCabinet      : {
        type: String,
        default: null
    },
    siren           : {
        type: String,
        required: true
    },
    address         : {
        type: String,
        default: null
    },
    codePostal      : {
        type: String,
        default: null
    },
    ville           : {
        type: String,
        default: null
    },
    image           : {
        type: String,
        default: null
    },
    zoneInter       : {
        type: [String],
        default: []
    },
    copros          : {
        type: [Schema.Types.ObjectId],
        default: []
    },
    role        	: {
        type: String,
        default: 'architecte'
    },
    honnorairesVisites  : [{
        date    : {type: Date, default: null},
        amount  : {type: Number, default: 0}
    }],
    honnorairesAvis     : [{
        date    : {type: Date, default: null},
        amount  : {type: Number, default: 0}
    }]
});

let architectes = mongoose.model('architectes', architectesSchema);

module.exports = architectes;

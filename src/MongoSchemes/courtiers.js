let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let courtiersSchema = new Schema({
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
    phone           : {
        type    : String,
        required: true
    },
    company         : {
        type    : String,
        default : null
    },
    image           : {
        type    : String,
        default : null
    },
    address         : {
        type    : String,
        default : null
    },
    codePostal      : {
        type    : String,
        default : null
    },
    ville           : {
        type    : String,
        default : null
    },
    syndics         : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    parc            : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    role        	: {
        type    : String,
        default : 'courtier'
    }
});

let courtiers = mongoose.model('courtiers', courtiersSchema);

module.exports = courtiers;

let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let architectesSchema = new Schema({
    email       	: String,
    firstName   	: String,
    lastName    	: String,
    password    	: String,
    phone           : String,
    nomCabinet      : String,
    siren           : String,
    address         : String,
    codePostal      : String,
    ville           : String,
    image           : String,
    civility        : String,
    zoneInter       : [String],
    copros          : [Schema.Types.ObjectId],
    role        	: {
        type: String,
        default: 'architecte'
    },
});

let architectes = mongoose.model('architectes', architectesSchema);

module.exports = architectes;

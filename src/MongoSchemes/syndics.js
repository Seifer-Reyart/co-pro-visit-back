let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let syndicsSchema = new Schema({
    email       	: String,
    firstName   	: String,
    lastName    	: String,
    password    	: String,
    nomSyndic       : String,
    image           : String,
    siren           : String,
    address         : String,
    codePostal      : String,
    ville           : String,
    phone           : String,
    gestionnaires   : [Schema.Types.ObjectId],
    parc            : [Schema.Types.ObjectId],
    enCoursSelect   : [Schema.Types.ObjectId],
    courtiers       : [Schema.Types.ObjectId],
    role        	: {
        type: String,
        default: 'syndic'
    },
});

let syndics = mongoose.model('syndics', syndicsSchema);

module.exports = syndics;

let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let courtiersSchema = new Schema({
    email       	: String,
    firstName   	: String,
    lastName    	: String,
    password    	: String,
    phone           : String,
    company         : String,
    image           : String,
    syndics         : [Schema.Types.ObjectId],
    parc            : [Schema.Types.ObjectId],
    role        	: {
        type: String,
        default: 'courtier'
    }
});

let courtiers = mongoose.model('courtiers', courtiersSchema);

module.exports = courtiers;

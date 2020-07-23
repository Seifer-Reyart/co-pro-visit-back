let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let adminsSchema = new Schema({
    email       	: String,
    firstName   	: String,
    lastName    	: String,
    password    	: String,
    role        	: {
        type: String,
        default: 'admin'
    },
});

let admins = mongoose.model('admins', adminsSchema);

module.exports = admins;
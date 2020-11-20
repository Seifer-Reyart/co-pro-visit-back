let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let pcsSchema = new Schema({
    email       	: String,
    firstName   	: String,
    lastName    	: String,
    password    	: String,
    phone           : String,
    image           : String,
    coproId         : Schema.Types.ObjectId,
    permissions     : [0, 0, 0],
    role        	: {
        type: String,
        default: 'pcs'
    },
});

let pcs = mongoose.model('pcs', pcsSchema);

module.exports = pcs;

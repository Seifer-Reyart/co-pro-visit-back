let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let incidentsSchema = new Schema({
    date                    : {
        type: Date,
        required: false
    },
    metrages                : {
        type: Number,
        required: true
    },
    desordre                : {
        type: String,
        required: true
    },
    situation               : {
        type: String,
        required: true
    },
    description             : {
        type: String,
        required: true
    },
    corpsEtat               : {
        type: String,
        required: true
    },
    images                  : {
        type: String,
        required: true
    },
    coproId    	            : {
        type: Schema.Types.ObjectId,
        required: false
    },
    syndicId    	        : {
        type: Schema.Types.ObjectId,
        required: false
    },
    visitId    	            : {
        type: Schema.Types.ObjectId,
        required: false
    },
    gestionnaireId    	    : {
        type: Schema.Types.ObjectId,
        required: false
    },
    courtierId    	        : {
        type: Schema.Types.ObjectId,
        required: false
    },
});

let incidents = mongoose.model('incidents', incidentsSchema);

module.exports = incidents;

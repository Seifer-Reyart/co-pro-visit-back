let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let incidentsSchema = new Schema({
    date                    : {
        type    : Date,
        default : new Date()
    },
    metrages                : {
        type    : Number,
        required: true
    },
    desordre                : {
        type    : String,
        required: true
    },
    situation               : {
        type    : String,
        required: true
    },
    description             : {
        type    : String,
        required: true
    },
    corpsEtat               : {
        type: [String],
        required: true
    },
    images                  : {
        type: [String],
        required: true
    },
    visiteId    	            : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    coproId    	            : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    syndicId    	        : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    gestionnaireId    	    : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    architecteId: {
        type    : Schema.Types.ObjectId,
        default : null
    },
    courtierId    	        : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    commentaire             : {
        type    : String,
        default : null
    },
    devis                   : {
        type    : [Schema.Types.ObjectId],
        default : []
    }
});

let incidents = mongoose.model('incidents', incidentsSchema);

module.exports = incidents;

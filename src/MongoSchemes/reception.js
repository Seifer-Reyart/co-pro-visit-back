let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let receptionSchema = new Schema({
    src_img         : {type: String, default: null},
    evaluationTTC   : {type: Number, default: 0},
    metrages        : {type: Number, default: 0},
    comArchi        : {type: String, default: null},
    comPrest        : {type: String, default: null},
    desordre        : {type: String, default: null},
    description     : {type: String, default: null},
    situation       : {type: String, default: null},
    corpsEtat       : {type: [String], default: []},
    images_bf       : {type: [String], default: []},
    images_af       : {type: [String], default: []},
    date            : {type: Date, default: new Date()},
    conformite      : {type: Boolean, default: true},
    rate            : {type: Number, default: 5},
    remarque        : {type: String, default: null},
    incidentId      : {type: Schema.Types.ObjectId, default: null},
    coproId    	    : {type: Schema.Types.ObjectId, default: null},
    pcsId           : {type: Schema.Types.ObjectId, default: null},
    devisId         : {type: Schema.Types.ObjectId, default: null},
    syndicId        : {type: Schema.Types.ObjectId, default: null},
    visiteId        : {type: Schema.Types.ObjectId, default: null},
    courtierId      : {type: Schema.Types.ObjectId, default: null},
    architecteId    : {type: Schema.Types.ObjectId, default: null},
    prestataireId   : {type: Schema.Types.ObjectId, default: null},
    gestionnaireId  : {type: Schema.Types.ObjectId, default: null},
    demandeDevis    : {type: Boolean, default: false},
    devisPDF        : {type: String, default: null},
    dateDepotDevis  : {type: Date, default: null},
    facturePDF      : {type: String, default: null},
    dateDepotFacture: {type: Date, default: null}
});

let receptions = mongoose.model('receptions', receptionSchema);

module.exports = receptions;

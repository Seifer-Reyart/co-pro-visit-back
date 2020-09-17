/****************************/
/*** import Mongo Schemes ***/
/****************************/

const   Copro       = require('../MongoSchemes/copros'),
        Batiment    = require('../MongoSchemes/batiments'),
        Devis   = require('../MongoSchemes/devis');

/************/
/* Function */
/************/

/* complete/update Copro */

let updateCopro = (req, res) => {
    const {_id} = req.body;
    let update = req.body;
    delete update._id;
    if (req.user.role !== 'gestionnaire' && req.user.role !== 'syndic') {
        res.status(401).send({success: false, message: 'accès interdit'});
    } else {
        Copro.findOneAndUpdate({_id}, {$set: {update}}, {new: true}, async (err, copro) => {
            if (err)
                res.status(400).send({success: false, message: err});
            else
                res.status(200).send({success: true, message: 'La Copro a été mise à jour', copro});
        });
    }
}

/* Export Functions */

module.exports = {
    updateCopro
}

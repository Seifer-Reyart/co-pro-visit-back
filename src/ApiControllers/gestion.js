/****************************************/
/*** import modules from node_modules ***/
/****************************************/

let bcrypt  = require('bcryptjs');
let multer  = require('multer');
let path    = require("path");
let fs      = require('fs');
let crypto  = require('crypto');

/***************/
/*** helpers ***/
/***************/

let {
    sendCredentials,
    sendDemandeCourtier,
    sendDemandePrestataire,
} = require('../Config/mailer');

let {
    generateP,
    salt
} = require('./create');

/****************************/
/*** import Mongo Schemes ***/
/****************************/

const   Syndic          = require('../MongoSchemes/syndics'),
        Courtier        = require('../MongoSchemes/courtiers'),
        Architecte      = require('../MongoSchemes/architectes'),
        PresidentCS     = require('../MongoSchemes/presidentCS'),
        Prestataire     = require('../MongoSchemes/prestataires'),
        Gestionnaire    = require('../MongoSchemes/gestionnaires');

const   Copro       = require('../MongoSchemes/copros'),
        Batiment    = require('../MongoSchemes/batiments');

const   Devis       = require('../MongoSchemes/devis'),
        Visite      = require('../MongoSchemes/visites'),
        Incident    = require('../MongoSchemes/incidents'),
        Reception   = require('../MongoSchemes/reception');

/************/
/* Function */
/************/

/************/
/* Function */
/************/

/*** suppression incident ***/
let deleteIncident = (req, res) => {
	if (req.user.role !== 'architecte')
		res.status(401).send({success: false, message: 'accès interdit'});
	else {
		const { incidentId } = req.body
		Architecte.findOne({_id: req.user.id}, (err, presta) => {
			if (err)
				res.status(400).send({success: false, message: 'erreur system', err});
			else if (!presta)
				res.status(403).send({success: false, message: 'Architecte introuvable'});
			else {
				Incident.findOne({_id: incidentId, architecteId: req.user.id}, (err, incident) => {
					if (err)
						res.status(400).send({success: false, message: 'erreur system', err});
					else if (!incident)
						res.status(403).send({success: false, message: 'Incident introuvable'});
					// else if (!incident.devis?.find(dev => dev.devisPDF))
					//           res.status(403).send({success: false, message: 'Impossible à supprimer car travaux en cours.'});
					else {
						Copro.updateOne({_id: incident.coproId},
							{$pull: {incidentId}},
							(err, copr) => {
								if (err)
									res.status(400).send({success: false, message: 'erreur system désassignation prestataires', err});
								else {
									Prestataire.updateMany({_id: incidentId, architecteId: req.user.id},
										{$pull: {incidentId}},
										(err, prestaWithInci) => {
											if (err)
												res.status(400).send({success: false, message: 'erreur system désassignation prestataires', err});
											else {
												Incident.deleteOne({_id: incidentId}, (err) => {
													if (err)
														res.status(400).send({success: false, message: 'erreur system suppression incident', err});
													else
														res.status(200).send({success: true, message: 'Incident supprimé avec succès'});
												})
											}
										})
								}
							})
					}
				}).populate('devis')
			}
		})
	}
}

/*** ouvrir accès pcs ***/

let openAccessPCS = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {nomPCS, prenomPCS, emailPCS, phonePCS, coproId} = req.body;

        if (!nomPCS && !prenomPCS && !emailPCS && !phonePCS && !coproId)
            res.status(403).send({success: false, message: 'veuillez renseigner tous les champs du formulaire'});
        else {
            PresidentCS.findOne({email: emailPCS.toLowerCase()},
                async (err, pcs) => {
                   if (err)
                       res.status(400).send({success: false, message: 'erreur système', err});
                   else if (pcs) {
                       Copro.findOneAndUpdate(
                           {_id: coproId},
                           {pcs: pcs._id},
                           {new: false},
                           async (err, cpr) => {
                               if (err)
                                   res.status(400).send({success: false, message: 'erreur système', err});
                               else if (!cpr)
                                   res.status(404).send({success: false, message: 'Copro introuvable'});
                               else if (cpr.pcs === pcs._id)
                                   res.status(200).send({success: true, message: 'email identique, aucun changement effectué', pcs});
                               else if (cpr.pcs !== pcs._id) {
                                   if (cpr.pcs)
                                       await PresidentCS.findOneAndUpdate(
                                           {_id: cpr.pcs},
                                           {$set: {coproId: null}},
                                           {new: true},
                                           (err) => {
                                               if (err)
                                                   console.log(err);
                                           });
                                   await PresidentCS.findOneAndUpdate(
                                       {_id: pcs._id},
                                       {$set: {coproId: cpr._id}},
                                       {new: true},
                                       async (err) => {
                                           if (err)
                                               console.log(err);
                                           else {
                                               await Devis.updateMany({coproId: cpr._id}, {$set: {pcsId: pcs._id}}, {new: false}, (err) => {console.log(err)});
                                               await Reception.updateMany({coproId: cpr._id}, {$set: {pcsId: pcs._id}}, {new: false}, (err) => {console.log(err)});
                                               res.status(200).send({success: true, message: 'Accès au PCS ouvert', pcs});
                                           }
                                       });
                               }
                           });
                   } else {
                       let password = await generateP();
                       let pcsSave = new PresidentCS({
                           email    : emailPCS.toLowerCase(),
                           firstName: prenomPCS.toLowerCase(),
                           lastName : nomPCS.toLowerCase(),
                           password : bcrypt.hashSync(password, salt),
                           phone    : req.body.phonePCS,
                           coproId  : coproId,
                       });
                       pcsSave.save(async function (err, p) {
                           if (err)
                               res.status(400).send({success: false, message: 'erreur système', err});
                           else {
                               await Copro.findOneAndUpdate(
                                   {_id: coproId},
                                   {$set: {pcs: p._id}},
                                   {new: false},
                                   async function (err, cp) {
                                       if (err)
                                           res.status(400).send({success: false, message: 'erreur système', err});
                                       else if (!cp)
                                           res.status(404).send({success: false, message: 'Copro introuvable'});
                                       else {
                                           if (cp.pcs && cp.pcs !== p._id) {
                                               await PresidentCS.findOneAndUpdate(
                                                   {_id: cp.pcs},
                                                   {$set: {coproId: null}},
                                                   {new: true},
                                                   (err) => {
                                                       if (err)
                                                           console.log(err);
                                                   })
                                           }
                                           await Devis.updateMany({coproId: cp._id}, {$set: {pcsId: p._id}}, {new: false}, (err) => {console.log(err)});
                                           await Reception.updateMany({coproId: cp._id}, {$set: {pcsId: p._id}}, {new: false}, (err) => {console.log(err)});
                                           await sendCredentials(req.body.emailPCS.toLowerCase(), password);
                                           res.status(200).send({success: true, message: 'Accès au PCS ouvert', pcs: p});
                                       }
                                   });
                           }
                       });
                   }
                });
        }
    }
}

/*** demande Visite ***/

let demandeVisite = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Visite.findOne({coproId: req.body.coproId}, function (err, visite) {
            if (err)
                res.status(400).send({success: false, message: 'erreur system', err});
            else if (visite)
                res.status(403).send({success: false, message: 'une visite a déjà été demandé'});
            else {
                const {coproId} = req.body;
                Syndic.findOne({$or: [{_id: req.user.id}, {gestionnaires: {$elemMatch: {$eq: req.user.id}}}]}, (err, synd) => {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur system', err});
                    else if (!synd)
                        res.status(400).send({success: false, message: 'syndic introuvable'});
                    else
                        Copro.findOne({_id: coproId}, function (err, copro) {
                            if (err)
                                res.status(400).send({success: false, message: 'erreur system', err});
                            else if (!copro)
                                res.status(403).send({success: false, message: "la Copro n'existe pas"});
                            else {
                                let visite;
                                visite = new Visite({
                                    coproId    	    : copro._id,
                                    nomCopro        : copro.nomCopro,
                                    reference       : copro.reference,
                                    gardien         : req.body.gardien,
                                    accessCode      : req.body.accessCode,
                                    cleCabinet      : req.body.cleCabinet,
                                    commentaire     : req.body.commentaire,
                                    nomPCS          : req.body.nomPCS,
                                    emailPCS        : req.body.emailPCS,
                                    phonePCS        : req.body.phonePCS,
                                    syndicId        : synd._id,
                                    gestionnaireId  : copro.gestionnaire,
                                    demandeLe       : new Date(),
                                    done            : false
                                });
                                visite.save(async function(err, v) {
                                    if (err || !v)
                                        res.status(400).send({success: false, message: 'erreur system', err});
                                    else {
                                        await Copro.updateOne(
                                            {_id: copro._id},
                                            {$set: {dateDemandeVisite: new Date()}},
                                            async function (err) {
                                                if (err)
                                                    res.status(400).send({success: false, message: 'erreur system', err});
                                                else {
                                                    res.status(200).send({success: true, message: 'requête visite envoyée'});
                                                }
                                            });
                                    }
                                });
                            }
                        })
                });
            }
        })
    }
}

let assignerVisite = async (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        let error = [];
        let promise = await req.body.visites.map(visite => {
            Visite.findOneAndUpdate(
                {_id: visite},
                {$set: {architecteId: req.body.architecteId}},
                {new: true},
                function (err, visite) {
                    if (err || !visite)
                        error.push(err)
                    else
                        Architecte.findOneAndUpdate(
                            {_id: req.body.architecteId},
                            {$push: {copros: visite.coproId}},
                            {new: true},
                            (err) => {
                                if (err)
                                    error.push(err)
                            });
                });
        });
        await Promise.all(promise);
        if (error.length > 0)
            res.status(400).send({success: true, message: 'une ou plusieurs visites non assignées', error});
        else
            res.status(200).send({success: true, message: 'visite(s) assignée(s)'});
    }
}

let desassignerVisite = async (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        let error = [];
        let promise = await req.body.visites.map(visite => {
            Visite.findOneAndUpdate(
                {_id: visite},
                {$set: {architecteId: null}},
                {new: true},
                function (err, visite) {
                    if (err || !visite)
                        error.push(visite)
                    else
                        Architecte.findOneAndUpdate(
                            {_id: req.body.architecteId},
                            {$pull: {copros: visite.coproId}},
                            {new: true},
                            (err) => {
                                if (err)
                                    error.push(err)
                            });
                })
        });
        await Promise.all(promise);
        if (error.length > 0)
            res.status(400).send({success: true, message: "une ou plusieurs visites n'ont pû être supprimées", error});
        else
            res.status(200).send({success: true, message: 'visite(s) supprimée(s)'});
    }
}

let desassignerEtudeToCourtier = async (req, res) => {
    if (req.user.role !== 'courtier')
        res.status(401).send({succes: false, message: 'acces interdit'});
    else {
        const { coproId } = req.body
        Courtier.findOneAndUpdate({_id: req.user.id}, {$pull: {etudes: coproId}}, {new: true}, (err, courtier) => {
            if (err)
                res.status(400).send({success: false, message: "erreur système", err});
            else if (!courtier)
                res.status(404).send({success: false, message: "ce courtier n'existe pas"});
            else
                res.status(200).send({success: true, message: 'Désassignation réussi', courtier})
        })
    }
}

let demandeCourtier = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Syndic.findOne({_id: req.body.syndic}, async function (err, syndic) {
            if (err)
                res.status(400).send({success: false, message: "erreur système", err});
            else if (!syndic)
                res.status(404).send({success: false, message: "ce syndic n'existe pas"});
            else {
                let body = {...req.body, nomSyndic: syndic.nomSyndic}
                await sendDemandeCourtier(body);
                res.status(200).send({success: true, message: "demande envoyée, un administrateur va l'étudier"})
            }
        })
    }
}

let demandePrestataire = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Syndic.findOne({_id: req.user.id}, async function (err, synd) {
            if (err || !synd)
                res.status(400).send({success: false, message: "erreur système", err});
            else {
                let body = {
                    ...req.body,
                    nomSyndic: synd.nomSyndic
                }
                await sendDemandePrestataire(body);
                res.status(200).send({success: true, message: "demande envoyée"});
            }
        })
    }
}

let assignerCourtierToCopro = (req, res) => {
    let {copro, courtier} = req.body;
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Copro.findOne({_id: copro}, function (err, cop) {
            if (err)
                res.status(400).send({success: false, message: 'erreur recherche copro', err});
            else if (!cop)
                res.status(404).send({success: false, message: "cette Copro n'existe pas!"});
            else if (cop.courtier && cop.courtier === courtier)
                res.status(200).send({success: true, message: "le courtier est déjà assigné"});
            else {
                if (cop.courtier && cop.courtier !== courtier) {
                    Courtier.findOneAndUpdate(
                        {_id: cop.courtier},
                        {$pull: {parc: cop._id}},
                        {new: true},
                        function (err, court) {
                            if (err || !court)
                                console.log(err);
                        });
                }
                if (cop.courtier && courtier === 'null') {
                    Copro.findOneAndUpdate(
                        {_id: copro},
                        {$set: {courtier: null}},
                        {new: false},
                        function (err, cop) {
                            if (err || !cop) {
                                res.status(400).send({success: false, message: 'erreur assigniation dans copro', err});
                            } else {
                                res.status(200).send({
                                    success: true,
                                    message: "sans courtier assigné"
                                })
                            }
                        })
                } else if (!cop.courtier && courtier === 'null') {
                    res.status(200).send({
                        success: true,
                        message: "sans courtier assigné"
                    })
                } else
                    Copro.findOneAndUpdate(
                        {_id: copro},
                        {$set: {courtier: courtier}},
                        {new: false},
                        function (err, cop) {
                            if (err || !cop) {
                                res.status(400).send({success: false, message: 'erreur assigniation dans copro', err});
                            } else {
                                Courtier.findOneAndUpdate(
                                    {_id: courtier},
                                    {$push: {parc: cop._id}},
                                    {new: true},
                                    function (err, court) {
                                        if (err || !court) {
                                            res.status(400).send({
                                                success: false,
                                                message: 'erreur assigniation dans courtier',
                                                err
                                            });
                                        } else {
                                            Courtier.updateMany(
                                                {_id: { $ne: courtier}},
                                                {$pull: {etudes: cop._id} },
                                                {new: true},
                                                function(err) {
                                                    if (err) {
                                                        res.status(200).send({
                                                            success: false,
                                                            message: 'erreur désassignation des autres courtiers en étude',
                                                            err
                                                        });
                                                    } else
                                                        res.status(200).send({success: true, message: "le courtier a bien été assigné"})

                                                })
                                        }
                                    })
                            }
                        })
            }
        })
    }
}

let assignerCourtierToSyndic = async (req, res) => {
    if (req.user.role === 'admin') {
        let {syndics, courtier, option} = req.body;
        let errorSyndic = [];
        let errorCourtier = [];
        let successId = [];
        if (option) {
            let promises = await syndics.map(syndic => {
                Syndic.findOneAndUpdate(
                    {_id: syndic},
                    {$push: {courtiers: courtier}},
                    {new: true},
                    function (err, synd) {
                        if (err || !synd) {
                            console.log("err: ", err);
                            errorSyndic.push(synd._id);
                            //res.status(400).send({success: false, message: 'erreur assigniation dans syndic', err});
                        } else {
                            Courtier.findOneAndUpdate(
                                {_id: courtier},
                                {$push: {syndics: synd._id}},
                                {new: true},
                                function (err, court) {
                                    if (err || !court) {
                                        console.log("err: ", err)
                                        errorCourtier.push(syndic);
                                        //res.status(400).send({success: false, message: 'erreur assigniation dans courtier', err});
                                    } else
                                        successId.push(synd._id)
                                });
                        }
                    });
            });
            await Promise.all(promises);
            if (errorSyndic.length > 0 || errorCourtier.length > 0)
                res.status(400).send({success: false, message: 'erreur assigniation', errorSyndic, errorCourtier, successId});
            else
                res.status(200).send({success: true, message: "le courtier a bien été assigné", successId});
        } else {
            let promises = await syndics.map(syndic => {
                Syndic.findOneAndUpdate(
                    {_id: syndic},
                    {$pull: {courtiers: courtier}},
                    {new: true},
                    function (err, synd) {
                        if (err || !synd)
                            errorSyndic.push(synd._id);
                            //res.status(400).send({success: false, message: 'erreur assigniation dans syndic', err});
                        else {
                            Courtier.findOneAndUpdate(
                                {_id: courtier},
                                {$pull: {syndics: synd._id}},
                                {new: true},
                                function (err, court) {
                                    if (err || !court)
                                        errorCourtier.push(syndic);
                                        //res.status(400).send({success: false, message: 'erreur assigniation dans courtier', err});
                                    else
                                        successId.push(synd._id)
                                        //res.status(200).send({success: true, message: "le courtier a bien été assigné"})
                                });
                        }
                    });
            });
            await Promise.all(promises);
            if (errorSyndic.length > 0 || errorCourtier.length > 0)
                res.status(400).send({success: false, message: 'erreur désassigniation', errorSyndic, errorCourtier, successId});
            else
                res.status(200).send({success: true, message: "le courtier a bien été désassigné", successId})
        }
    } else if (req.user.role === 'syndic' || req.user.role === 'gestionnaire') {
        let {_id, courtierId} = req.body;

        Syndic.findOneAndUpdate(
            {$or: [{_id: _id}, {gestionnaires: {$elemMatch: {$eq: _id}}}]},
            {$pull: {courtiers: courtierId}},
            {new: true},
            function (err, synd) {
                if (err || !synd)
                    res.status(400).send({success: false, message: 'erreur désassigniation dans syndic', err});
                else {
                    Copro.updateMany(
                        {$and: [{_id: {$and: [{$in: synd.parc},{$in: synd.enCoursSelect}]}}, {courtier: courtierId}]},
                        {$set: {courtier: null}}, (err) => {
                           if (err)
                               console.log(err);
                        });
                    Courtier.findOneAndUpdate(
                        {_id: courtierId},
                        {
                            $pull:
                                {
                                    syndics: synd._id,
                                    parc: {$elemMatch: {$or: [{$eq: {$in: synd.parc}}, {$eq: {$in: synd.enCoursSelect}}]}},
                                    etudes: {$elemMatch: {$or: [{$eq: {$in: synd.parc}}, {$eq: {$in: synd.enCoursSelect}}]}},
                                }
                                },
                        {new: true},
                        function (err, court) {
                            if (err || !court)
                                res.status(400).send({success: false, message: 'erreur désassigniation dans courtier', err});
                            else
                                res.status(200).send({success: true, message: "le courtier a bien été désassigné du Syndic"})
                        });
                }
            });
    } else {
        res.status(401).send({success: false, message: 'accès interdit'});
    }
}

let assignerPrestataireToSyndic = async (req, res) => {
    const {prestataireId, syndics, option} = req.body;
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else if (!prestataireId || !syndics)
        res.status(403).send({success: false, message: 'syndicId et prestataireId requis'});
    else {
        let errorSyndic = [];
        let errorPresta = [];
        let successId = [];
        if (option) {
            let promises = await syndics.map(syndic => {
                Syndic.findOneAndUpdate(
                    {_id: syndic},
                    {$push: {prestataires: prestataireId}},
                    {new: true},
                    function (err, synd) {
                        if (err || !synd)
                            errorSyndic.push({success: false, message: 'erreur assigniation dans syndic', err});
                        else {
                            Prestataire.findOneAndUpdate(
                                {_id: prestataireId},
                                {$push: {syndics: synd._id}},
                                {new: true},
                                function (err, prest) {
                                    if (err || !prest)
                                        errorPresta.push({success: false, message: 'erreur assigniation dans prestataire', err});
                                    else
                                        successId.push(synd._id)
                                });
                        }
                    });
            });
            await Promise.all(promises);
            if (errorSyndic.length > 0 || errorPresta.length > 0)
                res.status(400).send({success: false, message: 'erreur assigniation', errorSyndic, errorPresta, successId});
            else {
                Prestataire.findOne({_id: prestataireId}, (err, prest) => {
                    if (err) {
                        res.status(200).send({success: false, message: 'erreur assigniation', err, successId});
                    } else {
                        Incident.find(
                            {$and: [{corpsEtat: {$elemMatch: {$in: prest.corpsEtat}}}, {syndicId: {$in: syndics}}]},
                            (err, incidents) => {
                             if (err) {
                                 res.status(200).send({
                                     success: true,
                                     message: "le Prestataire a bien été assigné",
                                     successId,
                                     err
                                 });
                             } else if (!incidents) {
                                 res.status(200).send({
                                     success: true,
                                     message: "le Prestataire a bien été assigné",
                                     successId
                                 });
                             } else {
                                 let ids = prest.incidentId;
                                 for (let i in incidents) {
                                     if (!prest.incidentId.includes(incidents[i]._id))
                                         ids.push(incidents[i]._id);
                                 }

                                 Prestataire.findOneAndUpdate(
                                     {_id: prest._id},
                                     {$set: {incidentId: ids}},
                                     {new: false},
                                     (err) => {
                                         if (err) {
                                             console.log("assign Prestataire.findOneAndUpdate: ", err)
                                             res.status(200).send({
                                                 success: true,
                                                 message: "le Prestataire a bien été assigné",
                                                 successId,
                                                 err
                                             });
                                         } else
                                             res.status(200).send({success: true, message: "le Prestataire a bien été assigné", successId});
                                     })
                             }
                            })
                    }
                })
            }
        } else {
            let promises = await syndics.map(syndic => {
                Syndic.findOneAndUpdate(
                    {_id: syndic},
                    {$pull: {prestataires: prestataireId}},
                    {new: true},
                    function (err, synd) {
                        if (err || !synd)
                            errorSyndic.push({success: false, message: 'erreur désassigniation dans syndic', err})
                        else {
                            Prestataire.findOneAndUpdate(
                                {_id: prestataireId},
                                {$pull: {syndics: synd._id}},
                                {new: true},
                                function (err, prest) {
                                    if (err || !prest)
                                        errorPresta.push({success: false, message: 'erreur désassigniation dans prestataire', err});
                                    else
                                        successId.push(synd._id)
                                });
                        }
                    });
            });
            await Promise.all(promises);
            if (errorSyndic.length > 0 || errorPresta.length > 0)
                res.status(400).send({success: false, message: 'erreur désassigniation', errorSyndic, errorPresta, successId});
            else {
                Prestataire.findOne({_id: prestataireId}, (err, prest) => {
                    if (err)
                        res.status(200).send({success: false, message: 'erreur assigniation', err, successId});
                    else
                        Incident.find({$and: [{_id: {$in: prest.incidentId}}, {syndicId: {$in: syndics}}]}, (err, incidents) => {
                            if (err || !incidents)
                                res.status(200).send({success: true, message: "le Prestataire a bien été désassigné", successId, err});
                            else {
                                let ids = [];
                                let result = [];
                                let toRemove = [];
                                for (let i in incidents) {
                                    ids.push(incidents[i]._id);
                                }
                                for (let i in prest.incidentId) {
                                    if (!ids.includes(prest.incidentId[i]))
                                        result.push(prest.incidentId[i]);
                                    else
                                        toRemove.push(prest.incidentId[i]);
                                }

                                Prestataire.findOneAndUpdate(
                                    {_id: prest._id},
                                    {$set: {incidentId: result}},
                                    {new: false},
                                    (err) => {
                                        if (err) {
                                            res.status(200).send({
                                                success: false,
                                                message: "le Prestataire a bien été désassigné",
                                                successId,
                                                err
                                            });
                                        } else {
                                            Devis.deleteMany({$and: [{prestataireId}, {incidentId: {$in: toRemove}}]}, (err, result) => {
                                                if (err)
                                                    console.log("err: ", err);
                                                else
                                                    console.log("deleted: ", result);
                                            });
                                            res.status(200).send({success: true, message: "le Prestataire a bien été désassigné", successId});
                                        }
                                    });
                            }
                        })
                })
            }
        }
    }
}

let assignerGestionnaireToCopro = (req, res) => {
    const {gestionnaireId, coproId, isParc} = req.body;
    if (req.user.role !== 'syndic')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Copro.findOneAndUpdate(
            {$and: [{_id: coproId},{$or: [{syndicNominated: req.user.id}, {syndicEnCours: {$elemMatch: {$eq: req.user.id}}}]}]},
            {$set: {gestionnaire: gestionnaireId}},
            {new: true},
            function (err, copro) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else if (!copro)
                    res.status(404).send({success: false, message: "cette Copropriété n'existe pas"});
                else {
                    Visite.findOneAndUpdate(
                        {coproId: copro._id},
                        {$set: {gestionnaireId}},
                        {new: false},
                        (err) => {
                            if (err)
                                console.log(err)
                        });
                    if (isParc)
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$push: {parc: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else {
                                    res.status(200).send({
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été ajouté au parc de "+gest.firstName
                                        });
                                }
                            }
                        )
                    else
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$push: {enCoursSelect: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été ajouté à la liste 'en cours de selection' de "+gest.firstName
                                        })
                            }
                        )
                }
            })
}

let desassignerGestionnaireToCopro = (req, res) => {
    const {gestionnaireId, coproId, isParc} = req.body;
    if (req.user.role !== 'syndic')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Copro.findOneAndUpdate(
            {$and: [{_id: coproId},{$or: [{syndicNominated: req.user.id}, {syndicEnCours: req.user.id}]}]},
            {$set: {gestionnaire: null}},
            {new: true}, function (err, copro) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else if (!copro)
                    res.status(404).send({success: false, message: "cette Copropriété n'existe pas"});
                else {
                    if (isParc)
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$pull: {parc: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été supprimée du parc de "+gest.firstName
                                        })
                            }
                        )
                    else
                        Gestionnaire.findOneAndUpdate(
                            {$and: [{_id: gestionnaireId},{syndic: req.user.id}]},
                            {$pull: {enCoursSelect: coproId}},
                            {new: true},
                            function (err, gest) {
                                if (err)
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                else if (!gest)
                                    res.status(404).send({success: false, message: "ce Gestionnaire n'existe pas"});
                                else
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été supprimée de la liste 'en cours de selection' de "+gest.firstName
                                        })
                            }
                        )
                }
            })
}

let deleteSyndic = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else
        Syndic.findOne({_id: req.body._id}, async function (err, synd) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else if (!synd)
                res.status(404).send({success: false, message: "ce Syndic n'existe pas"});
            else {
                await Gestionnaire.deleteMany({syndic: synd._id}, function (err) {
                    if (err)
                        console.log('delete Gestionnaire error: ', err);
                });
                await Copro.find({syndicNominated: synd._id}, function (err, copros) {
                    if (err)
                        console.log('find Copros error: ', err);
                });
                await Batiment.deleteMany({coproId: {$in: synd.parc}}, function (err) {
                    if (err)
                        console.log('delete Batiment error: ', err);
                });
                await Courtier.updateMany(
                    {syndics: {$elemMatch: {$eq: synd._id}}},
                    {$pull: {syndics: synd._id}},
                    function (err) {
                        if (err)
                            console.log('update Courtier err: ', err)
                    });
                await Architecte.updateMany(
                    {copros: {$elemMatch: {$in: synd.parc}}},
                    {$pull: {copros: {$in: synd.parc}}},
                    function (err) {
                        if (err)
                            console.log('update architecte err: ', err)
                    });
                await Visite.deleteMany({syndicId: synd._id}, function (err) {
                    if (err)
                        console.log('delete Visites error: ', err);
                });
                await Prestataire.updateMany(
                    {syndics: {$elemMatch: {$eq: synd._id}}},
                    {$pull: {syndics: synd._id}},
                    function (err) {
                        if (err)
                            console.log('update Prestataire error: ', err)
                    });
                Syndic.deleteOne({_id: synd._id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else
                        res.status(200).send({success: false, message: 'Syndic supprimé avec succès'});
                });
            }
        })
}

let changeStatusCopro = async (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        let syndicId = '';
        let err = {
            message: '',
            error: null
        }
        if (req.user.role === 'syndic')
            syndicId = req.user.id;
        else {
            let gestionnaire = {};
            await Gestionnaire.findOne({_id: req.user.id}, (error, gest) => {
                if (error) {
                    err.message = 'erreur système';
                    err.error = error
                } else if (!gest)
                    console.log("ce Gestionnaire n'existe pas!");
                else
                    return gest;
            }).then(gest => gestionnaire = gest);

            syndicId = gestionnaire.syndic;
        }
        if (!syndicId) {
            res.status(404).send({success: false, message: "cet utilisateur n'existe pas"});
        } else {
            const {coproId, isParc} = req.body;
            Copro.findOne({_id: coproId}, function (err, copro) {
                if (err) {
                    res.status(400).send({success: false, message: 'erreur système', err});
                } else if (isParc) {
                    Copro.findOneAndUpdate(
                        {_id: copro._id},
                        {
                            $set: {syndicNominated: syndicId, perdu: false, sansSuite: false},
                            $pull: {syndicEnCours: syndicId}
                        },
                        {new: true},
                        (err, cpr) => {
                            if (err) {
                                res.status(400).send({success: false, message: 'erreur système', err});
                            } else {
                                Syndic.findOneAndUpdate(
                                    {_id: cpr.syndicNominated},
                                    {$push: {parc: cpr._id}, $pull: {enCoursSelect: cpr._id}},
                                    {new: true},
                                    function (err) {
                                        if (err) {
                                            res.status(400).send({
                                                success: false,
                                                message: 'erreur système',
                                                err
                                            });
                                        } else if (cpr.gestionnaire !== null)
                                            Gestionnaire.findOneAndUpdate(
                                                {_id: cpr.gestionnaire},
                                                {
                                                    $push: {parc: cpr._id},
                                                    $pull: {enCoursSelect: cpr._id},
                                                    $set: {syndicDateNom: new Date()}
                                                },
                                                {new: true},
                                                function (err) {
                                                    if (err) {
                                                        res.status(400).send({
                                                            success: false,
                                                            message: 'erreur système',
                                                            err
                                                        });
                                                    } else {
                                                        res.status(200).send({
                                                            success: true,
                                                            message: "la copropriété est maintenant dans Mon Parc"
                                                        });
                                                    }
                                                });
                                        else
                                            res.status(200).send({
                                                success: true,
                                                message: "la copropriété est maintenant dans Mon Parc"
                                            });
                                    });
                            }
                        });
                } else {
                    Copro.findOneAndUpdate(
                        {_id: copro._id},
                        {
                            $set: {syndicNominated: null, perdu: true},
                            $push: {syndicEnCours: copro.syndicNominated}
                        },
                        {new: true},
                        (error, cpr) => {
                            if (error) {
                                res.status(400).send({
                                    success: false,
                                    message: 'erreur système',
                                    err: error
                                });
                            } else
                                Syndic.findOneAndUpdate(
                                    {_id: syndicId},
                                    {$pull: {parc: cpr._id}, $push: {enCoursSelect: cpr._id}},
                                    {new: true},
                                    function (err) {
                                        if (err) {
                                            res.status(400).send({
                                                success: false,
                                                message: 'erreur système',
                                                err
                                            });
                                        } else if (cpr.gestionnaire !== null)
                                            Gestionnaire.findOneAndUpdate(
                                                {_id: cpr.gestionnaire},
                                                {$pull: {parc: cpr._id}, $push: {enCoursSelect: cpr._id}},
                                                {new: true},
                                                function (err) {
                                                    if (err) {
                                                        res.status(400).send({
                                                            success: false,
                                                            message: 'erreur système',
                                                            err
                                                        });
                                                    } else {
                                                        res.status(200).send({
                                                            success: true,
                                                            message: "la copropriété est maintenant en cours de sélection"
                                                        });
                                                    }
                                                });
                                        else
                                            res.status(200).send({
                                                success: true,
                                                message: "la copropriété est maintenant en cours de sélection"
                                            });
                                    });
                        });
                }

            });
        }
    }
}

let deleteCopro = (req, res) => {
    if (req.user.role === 'syndic') {
        const {_id} = req.body;

        Copro.deleteOne({_id}, function (err) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else {
                Architecte.findOneAndUpdate(
                    {copros: {$elemMatch: {$eq: _id}}},
                    {$pull: {copros: _id}},
                    function (err) {
                        if (err)
                            res.status(400).send({success: false, message: 'erreur système', err});
                    });
                Courtier.findOneAndUpdate({parc: {$elemMatch: {$eq: _id}}},
                    {$pull: {parc: _id}},
                    function (err) {
                        if (err)
                            res.status(400).send({success: false, message: 'erreur système', err});
                    });
                Visite.deleteMany({coproId: _id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                });
                Batiment.deleteMany({coproId: _id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                });
                Incident.deleteMany({coproId: _id}, function (err) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                });

                Syndic.findOneAndUpdate(
                    {_id: req.user.id},
                    {$pull: {parc: _id, enCoursSelect: _id}},
                    {new: true},
                    function (err, synd) {
                        if (err)
                            res.status(400).send({success: false, message: 'erreur système', err});
                        else {
                            Gestionnaire.findOneAndUpdate(
                                {syndic: req.user.id},
                                {$pull: {parc: _id, enCoursSelect: _id}},
                                {new: true},
                                function (err) {
                                    if (err)
                                        console.log(err)
                                    else
                                        console.log("deleted from Gestionnaire as well")
                                });
                            res.status(200).send({success: true, message: 'copro supprimée'});
                        }
                    });
            }
        })
    } else if (req.user.role === 'gestionnaire') {
        const {_id, isParc} = req.body;
            Copro.findOne({_id}, function (err, copro) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else {
                    if (isParc) {
                        Copro.findOneAndUpdate(
                            {_id: copro._id},
                            {$set: {syndicNominated: null, perdu: true}, $push: {syndicEnCours: copro.syndicNominated}},
                            {new: true},
                            (error, cpr) => {
                                if (error) {
                                    res.status(400).send({success: false, message: 'erreur système', err: error});
                                } else if (cpr.gestionnaire !== null)
                                    Gestionnaire.findOneAndUpdate(
                                        {_id: cpr.gestionnaire},
                                        {$pull: {parc: cpr._id}, $push: {enCoursSelect: cpr._id}},
                                        {new: true},
                                        function (err, gest) {
                                            if (err) {
                                                res.status(400).send({
                                                    success: false,
                                                    message: 'erreur système',
                                                    err
                                                });
                                            } else {
                                                Syndic.findOneAndUpdate(
                                                    {_id: gest.syndic},
                                                    {$pull: {parc: cpr._id}, $push: {enCoursSelect: cpr._id}},
                                                    {new: true},
                                                    (err) => {
                                                        if (err)
                                                            console.log(err)
                                                        else
                                                            console.log("removed from Syndic parc as well")
                                                    });
                                                res.status(200).send({
                                                    success: true,
                                                    message: 'la copropriété est maintenant dans en cours de sélection et requalifiée comme "Perdue"'
                                                });
                                            }
                                        });
                                else
                                    res.status(200).send({
                                        success: true,
                                        message: 'la copropriété est maintenant dans en cours de sélection et requalifiée comme "Perdue"'
                                    });
                            });
                    } else {
                        Copro.findOneAndUpdate(
                            {_id: copro._id},
                            {$set: {sansSuite: true}},
                            {new: true},
                            (error) => {
                                if (error) {
                                    res.status(400).send({success: false, message: 'erreur système', err: error});
                                } else {
                                    res.status(200).send({
                                        success: true,
                                        message: 'la copropriété est requalifiée comme "Sans suite"',
                                    });
                                }
                            });
                    }
                }
            });
    } else {
        res.status(401).send({success: false, message: 'accès interdit'});
    }
}

let annulerVisite = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {coproId} = req.body;
        Architecte.findOne({copros: {$elemMatch: {$eq: coproId}}}, function (err, archi) {
            if (err) {
                res.status(400).send({success: false, message: 'erreur système', err});
            } else if (archi)
                res.status(403).send({success: false, message: 'Désolé mais un architecte effectue la visite, merci de nous adresser rapidement un mail'});
            else
                Copro.findOneAndUpdate(
                    {_id: coproId},
                    {dateDemandeVisite: null, dateVisite: null},
                    {new: true},
                    function (err, cpr) {
                        if (err) {
                            res.status(400).send({success: false, message: 'erreur système', err});
                        } else if (!cpr)
                            res.status(404).send({success: false, message: "cette copropriété n'existe pas"});
                        else
                            Visite.findOneAndDelete({coproId}, function (err, visite) {
                               if (err) {
                                   res.status(400).send({success: false, message: 'erreur système', err});
                               } else if (!visite)
                                   res.status(404).send({success: false, message: "cette visite n'existe pas"});
                               else
                                   Copro.find(
                                       {$or: [{syndicNominated: req.user.id}, {syndicEnCours: {$elemMatch: {$eq: req.user.id}}}]},
                                       async function (err, copros) {
                                           if (err)
                                               res.status(400).send({success: false, message: 'erreur système', err});
                                           else if (!copros)
                                               res.status(404).send({success: false, message: "pas de copros associées"});
                                           else {
                                               let parc = [];
                                               let enCours = [];
                                               let i;
                                               for (i in copros) {
                                                   console.log(copros[i])
                                                   if (copros[i].syndicNominated)
                                                       await parc.push(copros[i]);
                                                   else
                                                       await enCours.push(copros[i]);
                                               }
                                               res.status(200).send({
                                                   success: true,
                                                   message: 'la visite a été annulée',
                                                   parc,
                                                   enCours
                                               });
                                           }
                                       }).populate({
                                           path: 'batiments',
                                           model: 'batiments'
                                       });
                            });

                });
        });
    }
}

let sendToEtude = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {coproId, courtiers} = req.body;
        Courtier.updateMany(
            {_id: {$in: courtiers}},
            {$addToSet: {etudes: coproId}},
            function (err) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else
                    res.status(200).send({success: true, message: 'Copro envoyé en étude'})
            });
    }

}

let aboPrestaToSyndic = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {prestaId, syndicId, option} = req.body;

        if (option) {
            Prestataire.findOneAndUpdate(
                {_id: prestaId},
                {$push: {abonnements: syndicId}},
                {new: true},
                function (err, prest) {
                   if (err)
                       res.status(400).send({success: false, message: 'erreur système', err});
                   else if (!prest)
                       res.status(404).send({success: false, message: "ce prestataire n'existe pas"});
                   else
                       res.status(200).send({success: true, message: 'prestataire abonné'});
                });
        } else {
            Prestataire.findOneAndUpdate(
                {_id: prestaId},
                {$pull: {abonnements: syndicId}},
                {new: true},
                function (err, prest) {
                    if (err)
                        res.status(400).send({success: false, message: 'erreur système', err});
                    else if (!prest)
                        res.status(404).send({success: false, message: "ce prestataire n'existe pas"});
                    else
                        res.status(200).send({success: true, message: 'prestataire désabonné'});
                });
        }
    }
}

let demandeDevis = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        console.log(req.body)
        const {devisId, option} = req.body;

        Devis.findOneAndUpdate(
            {_id: devisId},
            {$set: {demandeDevis: option}},
            {new: true},
            (err, devis) => {
                if (err) {
                    console.log(err)
                    res.status(400).send({success: false, message: "erreur système", err});
                } else if (!devis) {
                    console.log("not found")
                    res.status(404).send({success: false, message: "devis introuvable"});
                } else {
                    console.log("all good!!!")
                    res.status(200).send({success: true, message: "demande de devis envoyée!"});
                }
            }
        )
    }
}

let uploadStatSinistres = async (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {coproId} = req.body;

        let filesErrors = [];
        let filesUploaded = []
        let savedFileName = '';
        let promisesFiles = null;

        if (req.files) {
            promisesFiles = req.files.map(file => {
                return new Promise((resolve) => {
                    let filetypes = /jpeg|jpg|png|pdf|JPEG|JPG|PNG|PDF/;
                    let mimetype = filetypes.test(file.mimetype);
                    const hash = crypto.createHash('sha1')
                    let hashedBuffer = file.buffer;
                    hash.update(hashedBuffer);
                    let extension = file.mimetype.match(filetypes);
                    extension = extension?.length ? extension[0] : null;
                    savedFileName = `${hash.digest('hex')}.${extension}`

                    if (mimetype) {
                        fs.writeFile('./src/uploads/stats/' + savedFileName, file.buffer, (err) => {
                            if (err) {
                                filesErrors.push({fileTitle: file.originalname, err});
                                resolve()
                            } else {
                                filesUploaded.push(savedFileName);
                                resolve()
                            }
                        })
                    } else {
                        filesErrors.push({
                            fileTitle: file.originalname,
                            err: "Mauvais format, reçu " + file.mimetype + ", attendu: " + filetypes
                        });
                        resolve()
                    }
                })
            });
            await Promise.all(promisesFiles);

            Copro.findOneAndUpdate(
                {_id: coproId},
                {$set: {statSinistres: savedFileName, depotStats: new Date()}},
                {new: true},
                (err, cpr) => {
                    if (err) {
                        let path = './src/uploads/stats/' + savedFileName;
                        fs.unlink(path, (err) => {
                            if (err)
                                console.log(err)
                            res.status(400).send({success: false, message: "erreur système", err});
                        });
                    } else if (!cpr) {
                        let path = './src/uploads/stats/' + savedFileName;
                        fs.unlink(path, (err) => {
                            if (err)
                                console.log(err)
                            res.status(404).send({success: false, message: "copro introuvable"});
                        });
                    } else
                        res.status(200).send({success: true, message: "Stats Sinistres enregistrées"});
                })
        }
    }
}

let updatePermissionsGest = (req, res) => {
    if (req.user.role !== 'syndic')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {_id, permissions} = req.body;
        Gestionnaire.findOneAndUpdate(
            {_id},
            {$set: {permissions: permissions}},
            {new: true},
            (err, gest) => {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else if (!gest)
                    res.status(404).send({success: false, message: 'gestionnaire introuvable'});
                else
                    res.status(200).send({success: true, message: 'changement de droits effectué'});
            });
    }
}

/* Export Functions */

module.exports = {
    deleteCopro,
    deleteSyndic,
    demandeVisite,
    assignerVisite,
    desassignerVisite,
    demandePrestataire,
    demandeCourtier,
    changeStatusCopro,
    assignerCourtierToCopro,
    assignerCourtierToSyndic,
    assignerPrestataireToSyndic,
    assignerGestionnaireToCopro,
    desassignerGestionnaireToCopro,
	desassignerEtudeToCourtier,
    annulerVisite,
    sendToEtude,
    aboPrestaToSyndic,
    demandeDevis,
    uploadStatSinistres,
    updatePermissionsGest,
    openAccessPCS,
    deleteIncident,
}

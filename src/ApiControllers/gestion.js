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
    sendContactForm
} = require('../Config/mailer');

let {
    generateP,
    salt
} = require('./create');

const {pushNotifTo, notify} = require( "../Middleware/ApiHelpers");

/****************************/
/*** import Mongo Schemes ***/
/****************************/

const   Admin           = require('../MongoSchemes/admins'),
        Syndic          = require('../MongoSchemes/syndics'),
        Courtier        = require('../MongoSchemes/courtiers'),
        Architecte      = require('../MongoSchemes/architectes'),
        PresidentCS     = require('../MongoSchemes/presidentCS'),
        Prestataire     = require('../MongoSchemes/prestataires'),
        Gestionnaire    = require('../MongoSchemes/gestionnaires');

const   Copro       = require('../MongoSchemes/copros'),
        Batiment    = require('../MongoSchemes/batiments');

const   Devis           = require('../MongoSchemes/devis'),
        Visite          = require('../MongoSchemes/visites'),
        Incident        = require('../MongoSchemes/incidents'),
        Reception       = require('../MongoSchemes/reception'),
        Notification    = require('../MongoSchemes/notifications');

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
                                               notify(req, pcs?._id, req.user.id, `Vous avez maintenant accès à la copropriété ${cpr?.nomCopro}.`, "Accès copropriété", cpr._id, null)
                                               pushNotifTo(req, pcs?._id, `Vous avez maintenant accès à la copropriété ${cpr?.nomCopro}.`, "Accès copropriété")
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
                           phone    : phonePCS,
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
                                           notify(req, p?._id, req.user.id, `Vous avez maintenant accès à la copropriété ${cp?.nomCopro}.`, "Accès copropriété", cp._id, null)
                                           pushNotifTo(req, p?._id, `Vous avez maintenant accès à la copropriété ${cp?.nomCopro}.`, "Accès copropriété")
                                           // NOTIF ANCHOR
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
                                visite.save(function(err, v) {
                                    if (err || !v)
                                        res.status(400).send({success: false, message: 'erreur system', err});
                                    else {
                                        Admin.findOne({email: 'masterjcv'}, (err, admin) => {
                                            if (err)
                                                console.log(err)
                                            else {
                                                notify(req, admin._id, req.user.id, synd.nomSyndic+` a demandé une visite pour la copro du ${copro.address} - ${copro.codePostal} ${copro.ville}`, "demande de visite", copro._id, null);
                                                pushNotifTo(req, admin._id, synd.nomSyndic+` a demandé une visite pour la copro du ${copro.address} - ${copro.codePostal} ${copro.ville}`, "demande de visite");
                                            }
                                        });
                                        // NOTIF ANCHOR

                                        Copro.updateOne(
                                            {_id: copro._id},
                                            {$set: {dateDemandeVisite: new Date()}},
                                            (err) => {
                                                if (err)
                                                    res.status(400).send({success: false, message: 'erreur system', err});
                                                else {
                                                    Syndic.findOneAndUpdate(
                                                        {_id: synd._id},
                                                        {$inc: {credit: (-1 * copro.surface)}},
                                                        {new: true},
                                                        (err, s) => {
                                                            if (err)
                                                                res.status(400).send({success: false, message: 'erreur system', err});
                                                            else if (!s)
                                                                res.status(404).send({success: false, message: "ce syndic n'existe pas"});
                                                            else {
                                                                if (s.credit < 2800) {
                                                                    Admin.findOne({email: 'masterjcv'}, (err, admin) => {
                                                                        if (err)
                                                                            console.log(err)
                                                                        else {
                                                                            if (req.user.id !== s._id) {
                                                                                notify(req, req.user.id, admin._id, "Attention! votre crédit est inférieur à 2800", "Attention! votre crédit est inférieur à 2800", copro._id, null);
                                                                                pushNotifTo(req, req.user.id, "Attention! votre crédit est inférieur à 2800", "Alert Credit");
                                                                            }
                                                                            notify(req, s._id, admin._id, "Attention! votre crédit est inférieur à 2800", "Attention! votre crédit est inférieur à 2800", copro._id, null);
                                                                            pushNotifTo(req, s._id, "Attention! votre crédit est inférieur à 2800", "Alert Credit");
                                                                            notify(req, admin._id, req.user.id, "Attention! "+s.nomSyndic+" a un crédit inférieur à 2800", "Attention! "+s.nomSyndic+" a un crédit inférieur à 2800", copro._id, `/admin-copro/gerer-syndics/${s._id}`);
                                                                            pushNotifTo(req, admin._id, "Attention! "+s.nomSyndic+" a un crédit inférieur à 2800", "Alert Credit");
                                                                            // NOTIF ANCHOR
                                                                        }
                                                                    });
                                                                }
                                                                res.status(200).send({
                                                                    success: true,
                                                                    message: 'requête visite envoyée',
                                                                    credit: s.credit
                                                                });
                                                            }
                                                        });
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
                                else {
                                    notify(req, req.body.architecteId, req.user.id, `Une nouvelle demande de visite est disponible (N°${visite.reference}).`, "Demande de visite", visite.coproId, `/visites-a-faire/visites-formulaire/${visite.coproId}`)
                                    pushNotifTo(req, req.body.architecteId, `Une nouvelle demande de visite est disponible (N°${visite.reference})..`, "Demande de visite")
                                    // NOTIF ANCHOR
                                }
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
                                else {
                                    notify(req, req.body.architecteId, req.user.id, `La demande de visite (N°${visite.reference}) a été annulée par Coprovisit.`, "Demande de visite annulation", visite.coproId, null)
                                    pushNotifTo(req, req.body.architecteId, `La demande de visite (N°${visite.reference}) a été annulée par Coprovisit.`, "Demande de visite annulation")
                                }
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
        Syndic.findOne({$or: [{_id: req.user.id}, {gestionnaires: {$elemMatch: {$eq: req.user.id}}}]}, function (err, synd) {
            if (err)
                console.log(err);
            else if (!synd)
                console.log("Assignation copro - syndic not found");
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
                                    else {
                                        notify(req, court._id, req.user.id, `${synd?.nomSyndic} vous a retiré de la copropriété du ${cop.address} - ${cop.codePostal} ${cop.ville}.`, "Désassignation copropriété", cop._id, null)
                                        pushNotifTo(req, court._id, `${synd?.nomSyndic} vous a retiré de la copropriété du ${cop.address} - ${cop.codePostal} ${cop.ville}.`, "Désassignation copropriété")

                                    }
                                });
                        }
                        if (cop.courtier && courtier === 'null') {
                            Copro.findOneAndUpdate(
                                {_id: copro},
                                {$set: {courtier: null}},
                                {new: false},
                                function (err, copr) {
                                    if (err || !copr) {
                                        res.status(400).send({success: false, message: 'erreur assigniation dans copro', err});
                                    } else {
                                        notify(req, cop.courtier, req.user.id, `${synd.nomSyndic} vous a retiré de la copropriété du ${cop.address} - ${cop.codePostal} ${cop.ville}.`, "Désassignation copropriété", copr._id, null)
                                        pushNotifTo(req, cop.courtier, `${synd.nomSyndic} vous a retiré de la copropriété du ${cop.address} - ${cop.codePostal} ${cop.ville}.`, "Désassignation copropriété")
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
                                                    notify(req, courtier, req.user.id, `${synd.nomSyndic} vous a assigné à la copropriété du ${cop.address} - ${cop.codePostal} ${cop.ville}.`, "Assignation copropriété", cop._id, `/mes-syndics/mes-syndics-courtiers/mes-syndics-courtiers-details/${cop._id}`)
                                                    pushNotifTo(req, courtier, `${synd.nomSyndic} vous a assigné à la copropriété du ${cop.address} - ${cop.codePostal} ${cop.ville}.`, "Assignation copropriété")
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
                                    } else {
                                        notify(req, courtier, req.user.id, `Vous avez été assigné au syndic ${synd.nomSyndic}.`, "Assignation syndicat", null, null)
                                        pushNotifTo(req, courtier, `Vous avez été assigné au syndic ${synd.nomSyndic}.`, "Assignation syndicat")
                                        successId.push(synd._id)
                                    }
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
                                    else {
                                        notify(req, courtier, req.user.id, `Vous avez été assigné au syndic ${synd.nomSyndic}.`, "Assignation syndicat", null, null)
                                        pushNotifTo(req, courtier, `Vous avez été assigné au syndic ${synd.nomSyndic}.`, "Assignation syndicat")
                                        successId.push(synd._id)
                                    }
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
                            else {
                                notify(req, courtierId, req.user.id, `Vous avez été désassigné du syndic ${synd.nomSyndic}.`, "Désassignation syndicat", null, null)
                                pushNotifTo(req, courtierId, `Vous avez été désassigné du syndic ${synd.nomSyndic}.`, "Désassignation syndicat")
                                res.status(200).send({
                                    success: true,
                                    message: "le courtier a bien été désassigné du Syndic"
                                })
                            }
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
                                    else {
                                        notify(req, prestataireId, synd._id, `Vous avez été assigné au syndicat ${synd.nomSyndic}.`, "Assignation syndicat", null, `/mes-syndics/mes-syndics-prestataires/${synd._id}`)
                                        pushNotifTo(req, prestataireId, `Vous avez été assigné au syndicat ${synd.nomSyndic}.`, "Assignation syndicat")
                                        successId.push(synd._id)
                                    }
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
                                    else {
                                        notify(req, prestataireId, synd._id, `Vous avez été désassigné du syndicat ${synd.nomSyndic}.`, "Désassignation syndicat", null, `/mes-syndics/dashboard`)
                                        pushNotifTo(req, prestataireId, `Vous avez été désassigné du syndicat ${synd.nomSyndic}.`, "Désassignation syndicat")
                                        successId.push(synd._id)
                                    }
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
                                    notify(req, gestionnaireId, req.user.id, `La copropriété (${copro.nomCopro}) a été ajoutée à votre parc.`, "Assignation copropriété", coproId, `/mon-parc/mon-parc-immeuble/${coproId}`)
                                    pushNotifTo(req, gestionnaireId, `La copropriété (${copro.nomCopro}) a été ajoutée à votre parc.`, "Assignation copropriété")
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
                                else {
                                    notify(req, gestionnaireId, req.user.id, `La copropriété (${copro.nomCopro}) a été ajoutée à votre liste 'en cours de selection'.`, "Assignation copropriété", coproId, `/en-cours-selection/selection-immeuble/${coproId}`);
                                    pushNotifTo(req, gestionnaireId, `La copropriété (${copro.nomCopro}) a été ajoutée à votre liste 'en cours de selection'.`, "Assignation copropriété")
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été ajouté à la liste 'en cours de selection' de "+gest.firstName
                                        })
                                }
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
                                else {
                                    notify(req, gestionnaireId, req.user.id, `La copropriété (${copro.nomCopro}) a été retirée de votre parc.`, "Désassignation copropriété", coproId, null)
                                    pushNotifTo(req, gestionnaireId, `La copropriété (${copro.nomCopro}) a été retirée de votre parc.`, "Désassignation copropriété")
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été supprimée du parc de "+gest.firstName
                                        })
                                }
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
                                else {
                                    notify(req, gestionnaireId, req.user.id, `La copropriété (${copro.nomCopro}) a été retirée de votre liste 'en cours de selection'.`, "Désassignation copropriété", coproId, null)
                                    pushNotifTo(req, gestionnaireId, `La copropriété (${copro.nomCopro}) a été retirée de      votre liste 'en cours de selection'.`, "Désassignation copropriété")
                                    res.status(200).send(
                                        {
                                            success: true,
                                            message: "La copropriété ("+copro.nomCopro+") a bien été supprimée de la liste 'en cours de selection' de "+gest.firstName
                                        })
                                }
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

let annulerVisiteBis = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {coproId} = req.body;
        Architecte.findOne({copros: {$elemMatch: {$eq: coproId}}}, function (err, archi) {
            if (err) {
                res.status(400).send({success: false, message: 'erreur système', err});
            } else if (archi)
                res.status(403).send({success: false, message: 'Désolé mais un architecte effectue la visite, merci de nous adresser rapidement un mail'});
            else {
                let _id = req.user.id;
                Copro.findOneAndUpdate(
                    {_id: coproId},
                    {dateDemandeVisite: null, dateVisite: null},
                    {new: true},
                    function (err, cpr) {
                        if (err) {
                            res.status(400).send({success: false, message: 'erreur système', err});
                        } else if (!cpr)
                            res.status(404).send({success: false, message: "cette copropriété n'existe pas"});
                        else {
                            Visite.findOneAndDelete({coproId}, function (err, visite) {
                                if (err) {
                                    res.status(400).send({success: false, message: 'erreur système', err});
                                } else if (!visite)
                                    res.status(404).send({success: false, message: "cette visite n'existe pas"});
                                else {
                                    Syndic.findOneAndUpdate(
                                        {$or: [{_id}, {gestionnaires: {$elemMatch: {$eq: _id}}}]},
                                        {$inc: {credit: cpr.surface}},
                                        {new: true},
                                        (err, syndic) => {
                                           if (err)
                                               res.status(400).send({success: false, message: 'erreur système', err});
                                           else if (!syndic)
                                               res.status(404).send({success: false, message: "ce syndic n'existe pas"});
                                           else {
                                               notify(req, archi._id, syndic._id, `La demande de visite pour la Copro N° ${cpr.reference} a été annulée par ${syndic.nomSyndic}.`, "Visite annulée", null, null);
                                               pushNotifTo(req, archi._id, `La demande de visite pour la Copro N° ${cpr.reference} a été annulée par ${syndic.nomSyndic}.`, "Visite annulée");
                                               res.status(200).send({
                                                   success: true,
                                                   message: "demande annulée",
                                                   credit: syndic.credit
                                               });
                                           }
                                        });
                                }
                            });
                        }
                    });
            }
        });
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
                                       {$or: [{syndicNominated: req.user.id}, {syndicEnCours: {$elemMatch: {$eq: req.user.id}}}, {gestionnaire: req.user.id}]},
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
                                                   if (copros[i].syndicNominated)
                                                       await parc.push(copros[i]);
                                                   else
                                                       await enCours.push(copros[i]);
                                               }
                                               notify(req, archi._id, req.user.id, `La demande de visite pour la Copro N° ${visite.reference} a été annulée par le Syndic.`, "Visite annulée", null, null);
                                               pushNotifTo(req, archi._id, `La demande de visite pour la Copro N° ${visite.reference} a été annulée par le Syndic.`, "Visite annulée");
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
            {$addToSet: {etudes: coproId, dateEtudes: {coproId, date: new Date()}}},
            function (err) {
                if (err)
                    res.status(400).send({success: false, message: 'erreur système', err});
                else {
                    courtiers.map(crtId => {
                        notify(req, crtId, req.user.id, `Une nouvelle copropriété est disponible en étude !.`, "Copropriété en étude", coproId, `/a-etudier/a-etudier-details/${coproId}`);
                        pushNotifTo(req, crtId, `Une nouvelle copropriété est disponible en étude !.`, "Copropriété en étude");
                    })
                    res.status(200).send({success: true, message: 'Copro envoyé en étude'})
                }
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
                   else {
                       notify(req, prest._id, syndicId, `Vous êtes abonné PREMIUM à un syndic`, "Abonnement Syndic", null, `/mon-abonnement/dashboard`);
                       pushNotifTo(req, prest._id, `Vous êtes abonné PREMIUM à un syndic`, "Abonnement Syndic");
                       res.status(200).send({success: true, message: 'prestataire abonné'});
                   }
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
                    else {
                        notify(req, prest._id, syndicId, `Vous êtes abonné BASIC à un syndic`, "Abonnement Syndic", null, `/mon-abonnement/dashboard`);
                        pushNotifTo(req, prest._id, `Vous êtes abonné BASIC à un syndic`, "Abonnement Syndic");
                        res.status(200).send({success: true, message: 'prestataire désabonné'});
                    }
                });
        }
    }
}

let demandeDevis = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
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
                    if (option) {
                        notify(req, devis.prestataireId, devis.syndicId, `${devis.syndicId?.nomSyndic} a demandé un devis pour le desordre n°${devis?.refDesordre}.`, "Demande devis", devis?.coproId, `/mes-syndics/mes-syndics-prestataires/devis-prestataires/${devis?.coproId}`);
                        pushNotifTo(req, devis.prestataireId, `${devis.syndicId?.nomSyndic} a demandé un devis pour le desordre n°${devis?.refDesordre}.`, "Demande devis");
                        res.status(200).send({success: true, message: "demande de devis envoyée!"});
                    } else {
                        notify(req, devis.prestataireId, devis.syndicId, `${devis.syndicId?.nomSyndic} a annulé sa demande de devis pour le desordre n°${devis?.refDesordre}.`, "Demande devis annulation", devis?.coproId, null);
                        pushNotifTo(req, devis.prestataireId, `${devis.syndicId?.nomSyndic} a annulé sa demande de devis pour le desordre n°${devis?.refDesordre}.`, "Demande devis annulation");
                        res.status(200).send({success: true, message: "demande de devis annulée!"});
                    }
                }
            }
        ).populate({
            path: 'syndicId',
            model: 'syndics'
        });
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

let deletePresta = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const { _id } = req.body;
        Prestataire.findOne({_id}, function(err, prestataire) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else if (!prestataire)
                res.status(404).send({success: false, message: 'prestataire introuvable'});
            else {
                Syndic.updateMany(
                    {prestataires: {$elemMatch: {$eq: prestataire._id}}},
                    {$pull: {prestataires: prestataire._id}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Devis.deleteMany({prestataireId: prestataire._id}, (err) => {
                   if (err)
                       console.log(err);
                });
                Prestataire.deleteOne({_id: prestataire._id}, (err) => {
                   if (err)
                       res.status(400).send({success: false, message: "erreur système", err});
                   else
                       res.status(200).send({success: true, message: "Prestataire supprimé avec succès"});
                });
            }
        })
    }
}

let deleteCourt = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const { _id } = req.body;
        Courtier.findOne({_id}, function(err, courtier) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else if (!courtier)
                res.status(404).send({success: false, message: 'prestataire introuvable'});
            else {
                Syndic.updateMany(
                    {courtiers: {$elemMatch: {$eq: courtier._id}}},
                    {$pull: {courtiers: courtier._id}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Incident.updateMany(
                    {courtierId: courtier._id},
                    {$set: {courtierId: null}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Devis.updateMany(
                    {courtierId: courtier._id},
                    {$set: {courtierId: null}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Copro.updateMany(
                    {courtier: courtier._id},
                    {$set: {courtier: null}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Courtier.deleteOne({_id: courtier._id}, (err) => {
                    if (err)
                        res.status(400).send({success: false, message: "erreur système", err});
                    else
                        res.status(200).send({success: true, message: "Courtier supprimé avec succès"});
                });
            }
        })
    }
}

let deleteArchi = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Architecte.findOne({_id}, (err, architecte) => {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else if (!architecte)
                res.status(404).send({success: false, message: 'architecte introuvable'});
            else {
                Visite.updateMany(
                    {architecteId: architecte._id},
                    {$set: {architecteId: null}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Reception.updateMany(
                    {architecteId: architecte._id},
                    {$set: {architecteId: null}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Incident.updateMany(
                    {architecteId: architecte._id},
                    {$set: {architecteId: null}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Devis.updateMany(
                    {architecteId: architecte._id},
                    {$set: {architecteId: null}},
                    {new: true},
                    (err) => {
                        if (err)
                            console.log(err);
                    });
                Architecte.deleteOne({_id: architecte._id}, (err) => {
                    if (err)
                        res.status(400).send({success: false, message: "erreur système", err});
                    else
                        res.status(200).send({success: true, message: "Architecte supprimé avec succès"});
                })
            }
        })
    }
}

let ajoutCreditSyndic = (req, res) => {
    if (req.user.role !== 'admin')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        Syndic.findOneAndUpdate(
            {_id: req.body.syndic},
            {$inc: {credit: req.body.credit}},
            {new: true},
            (err, syndic) => {
                if (err)
                    res.status(400).send({success: false, message: "une erreur est survenue", err});
                else if (!syndic)
                    res.status(404).send({success: false, message: "ce syndic n'existe pas dans la base"});
                else {
                    notify(req, syndic._id, req.user.id, `${req.body.credit} de crédit a été ajouté à votre solde !`, "Ajout Crédit", null, "/mon-parc/dashboard")
                    pushNotifTo(req, syndic._id, `${req.body.credit} de crédit a été ajouté à votre solde !`, "Ajout Crédit")
                    res.status(200).send({
                        success: true,
                        message: "le crédit a bien été mis à jour",
                        credit: syndic.credit
                    });
                }
            })
    }
}

let updateUnseenNotification = (req, res) => {
    Notification.updateMany({receiver_id: req.user.id}, {date_seen: new Date()},(err) => {
        if (err)
            res.status(400).send({success: false, message: 'erreur système', err});
        else {
            Notification.find({receiver_id: req.user.id}, (err, notifications) => {
                res.status(200).send({
                    success: true,
                    message: 'Mise a jour du status des notifications réussie',
                    notifications,
                });

            })
        }
    })
}

let updateUnseenNotifByCopro = async (req, res) => {
    Notification.updateMany({$and: [{receiver_id: req.user.id},{coproId: req.body.coproId}]}, {date_seen: new Date()},(err) => {
        if (err)
            res.status(400).send({success: false, message: 'erreur système', err});
        else
            res.status(200).send({success: true, message: "Mise a jour du status des notifications réussie"});
    });
}

let removeSingleNotif = (req, res) => {
    Notification.findOneAndDelete({$and: [{_id: req.body._id}, {receiver_id: req.body.user}]}, (err, notif) => {
        if (err)
            res.status(400).send({success: false, message: "erreur lors de la suppression", err});
        else if (!notif)
            res.status(404).send({success: false, message: "notification introuvable"});
        else
            res.status(200).send({success: true, message: "suppression effectuée"});
    });
}

let contactCoproVisit = (req, res) => {
    const {objet, message} = req.body;

    if (!objet && !message)
        res.status(400).send({success: false, message: 'Veuillez vérifier les informations du formulaire'});
    else {
        Syndic.findOne({_id: req.user.id}, (err, syndic) => {
            if (err)
                res.status(400).send({success: false, message: "erreur système", err})
            else if (!syndic) {
                Gestionnaire.findOne({_id: req.user.id}, (err, gestionnaire) => {
                    if (err)
                        res.status(400).send({success: false, message: "erreur système", err})
                    else if (!gestionnaire) {
                        Prestataire.findOne({_id: req.user.id}, (err, prestataire) => {
                            if (err)
                                res.status(400).send({success: false, message: "erreur système", err})
                            else if (!prestataire) {
                                Courtier.findOne({_id: req.user.id}, (err, courtier) => {
                                    if (err)
                                        res.status(400).send({success: false, message: "erreur système", err})
                                    else if (!courtier) {
                                        Architecte.findOne({_id: req.user.id}, (err, architecte) => {
                                            if (err)
                                                res.status(400).send({success: false, message: "erreur système", err})
                                            else if (!architecte) {
                                                PresidentCS.findOne({_id: req.user.id}, (err, pcs) => {
                                                    if (err)
                                                        res.status(400).send({success: false, message: "erreur système", err})
                                                    else if (!pcs) {
                                                        res.status(404).send({success: false, message: 'utilisateur introuvable'})
                                                    } else {
                                                        let body = {
                                                            objet,
                                                            message,
                                                            nom: pcs.firstName + " " + pcs.lastName,
                                                            email: pcs.email,
                                                            telephone: pcs.phone,
                                                            type: "PCS"
                                                        };
                                                        sendContactForm(body);
                                                        res.status(200).send({success: true, message: 'Votre message a été envoyé à Coprovisit'});
                                                    }
                                                });
                                            } else {
                                                let body = {
                                                    objet,
                                                    message,
                                                    nom: architecte.firstName + " " + architecte.lastName,
                                                    email: architecte.email,
                                                    telephone: architecte.phone,
                                                    type: "Architecte"
                                                };
                                                sendContactForm(body);
                                                res.status(200).send({success: true, message: 'Votre message a été envoyé à Coprovisit'});
                                            }
                                        });
                                    } else {
                                        let body = {
                                            objet,
                                            message,
                                            nom: courtier.firstName + " " + courtier.lastName,
                                            email: courtier.email,
                                            telephone: courtier.phone,
                                            type: "Courtier"
                                        };
                                        sendContactForm(body);
                                        res.status(200).send({success: true, message: 'Votre message a été envoyé à Coprovisit'});
                                    }
                                });
                            } else {
                                let body = {
                                    objet,
                                    message,
                                    nom: prestataire.firstName + " " + prestataire.lastName,
                                    email: prestataire.email,
                                    telephone: prestataire.phone,
                                    type: "Prestataire"
                                };
                                sendContactForm(body);
                                res.status(200).send({success: true, message: 'Votre message a été envoyé à Coprovisit'});
                            }
                        });
                    } else {
                        let body = {
                            objet,
                            message,
                            nom: gestionnaire.firstName + " " + gestionnaire.lastName,
                            email: gestionnaire.email,
                            telephone: gestionnaire.phone,
                            type: "Gestionnaire"
                        };
                        sendContactForm(body);
                        res.status(200).send({success: true, message: 'Votre message a été envoyé à Coprovisit'});
                    }
                });
            } else {
                let body = {
                    objet,
                    message,
                    nom: syndic.firstName + " " + syndic.lastName,
                    email: syndic.email,
                    telephone: syndic.phone,
                    type: "Syndic"
                };
                sendContactForm(body);
                res.status(200).send({success: true, message: 'Votre message a été envoyé à Coprovisit'});
            }
        });
    }
}

let removeDemandeEval = (req, res) => {
    if (req.user.role !== 'syndic' && req.user.role !== 'gestionnaire')
        res.status(401).send({success: false, message: 'accès interdit'});
    else {
        const {prest_id, inc_id} = req.body;
        Prestataire.findOneAndUpdate({_id: prest_id}, {$pull: {incidentId: inc_id}}, {new: true}, function (err, prest) {
            if (err)
                res.status(400).send({success: false, message: 'erreur système', err});
            else if (!prest)
                res.status(404).send({success: false, message: 'prestataire introuvable'});
            else {
                Incident.findOne({_id: inc_id}, (err, inc) => {
                    if (err)
                        console.log(err);
                    else if (!inc)
                        console.log('not found');
                    else {
                        Devis.findOneAndDelete({$and: [{incidentId: inc._id}, {devisPDF: null}, {prestataireId: prest._id}]});
                        notify(req, prest._id, req.user.id, `${inc.syndicId.nomSyndic} a annulé sa demande d'évaluation pour le désordre ${inc.refDesordre}`, "Annulation Evaluation", inc.coproId, null);
                        pushNotifTo(req, prest._id, `${inc.syndicId.nomSyndic} a annulé sa demande d'évaluation pour le désordre ${inc.refDesordre}`, "Annulation Evaluation");
                        res.status(200).send({success: true, message: "suppression effectuée avec succès"});
                    }
                }).populate({
                    path: 'syndicId',
                    model: 'syndics'
                });
            }
        });
    }
}



/* Export Functions */

module.exports = {
    deleteCopro,
    deleteCourt,
    deleteArchi,
    deleteSyndic,
    deletePresta,
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
    annulerVisiteBis,
    sendToEtude,
    aboPrestaToSyndic,
    demandeDevis,
    uploadStatSinistres,
    updatePermissionsGest,
    openAccessPCS,
    deleteIncident,
    ajoutCreditSyndic,
    updateUnseenNotification,
    updateUnseenNotifByCopro,
    contactCoproVisit,
    removeDemandeEval,
    removeSingleNotif
}

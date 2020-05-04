/************************************/
/* import modules from node_modules */
/************************************/

let bCrypt  = require('bcryptjs');
let jwt     = require('jsonwebtoken');
let moment  = require('moment');

/************************/
/* import local modules */
/************************/

const   secretExpr  = require('../ApiConfig/tsconfig'),
        { admins }  = require('../models/users');

/*************/
/* functions */
/*************/

/**** slat to crypt passwords ****/
 let salt = bCrypt.genSaltSync(10);
/*********************************/

/* register new user */
let registerUser = function (req, res) {
    admins.findOne({$or: [{username: req.body.user.username}, {email: req.body.user.email}]}, function (err, user) { //
        if (user) {
            res.send({status: false, message: 'username and/or email already exist'});
        } else {
            let user = new admins({
                email: req.body.user.email.toLowerCase(),
                password: bCrypt.hashSync(req.body.user.password, salt),
                username: req.body.user.username.toLowerCase(),
                firstName: req.body.user.firstName,
                lastName: req.body.user.lastName,
                sex: req.body.user.sex,
                registerDate: new Date(),
                phone: {
                    value: req.body.user.phone.value,
                    kind: req.body.user.phone ? req.body.user.phone.kind : null,
                },
                role: 'admin'
            });
            user.save(function (err, user) {
                if (err) {
                    res.send({status: false, message: 'registration failed'});
                } else {
                    res.send({status: true, message: 'registration succeeded', user: user});
                }
            });
        }
    })
};

/* login user */
let loginUser = function (req, res) {
    admins.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, resp) {
        if (!err && resp) {
            if (!bCrypt.compareSync(req.body.password, resp.password)) {
                res.status(403).send({status: false, message: "informations de connexion invalides"});
            } else {
                let token = jwt.sign({_id: resp._id, role: resp.role}, secretExpr.secret, {expiresIn: '7d'}); // generate new access token which expires after 7 days without login
                let date = new Date();
                date.setDate(date.getDate() + 7); // set token's end of validity to 7 days from now -- days to be added value may be taken from collection securityconfigs (field: tokenExpire)
                admins.updateOne({"_id": resp._id},
                    {$set: {"tokenSession.token": token, "tokenSession.expire": date, "lastVisit": new Date()}},
                    function (err) {
                        if (err)
                            console.log(err);
                    });
                let user = {
                    _id: resp._id,
                    email: resp.email,
                    username: resp.username,
                    firstName: resp.firstName,
                    lastName: resp.lastName,
                    role: resp.role,
                    tokenSession: {
                        token: token,
                        expire: date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
                    }
                };

                res.status(200).send({status: true, state: "connexion réussie", user: user});
            }
        } else {
            console.log("error?: ", err)
            res.status(404).send({status: false, message: "utilisateur inconnu"});
        }
    })
};

/* logout user */
let logOutUser = function (req, res) {
    let date = new Date();
    date.setDate(date.getDate() - 1); // set token's end of validity to 30 days from now
    admins.updateOne({"_id": req.user._id}, {
        $set: {
            "tokenSession.token": "",
            "tokenSession.expire": date
        }
    }, function (err) {
        if (err)
            res.send({status: false, message: err});
        else {
            res.send({status: true, message: "déconnexion réussie"});
        }
    })
};

/* fetch user via his token if it's not expired*/

let fetchUserInfos = function (req, res) {
    if (!req.user) {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        // check date in token before send back user info, otherwhise... logout
        admins.findOne({"_id": req.user._id}, {"pin.value": 0, password: 0}, function (error, response) {
            if (error) {
                console.log(error)
                res.status(403).send({status: false, message: "utilisateur introuvable"});
            } else {
                res.status(200).send({status: true, user: response})
            }
        })
    }
};


module.exports = {
    registerUser,
    logOutUser,
    loginUser,
    fetchUserInfos
};

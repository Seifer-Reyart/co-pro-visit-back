/************************************/
/* import modules from node_modules */
/************************************/

let bcrypt  = require('bcryptjs');
let jwt     = require('jsonwebtoken');
let moment  = require('moment');

/************************/
/* import local modules */
/************************/

const   secretExpr  = require('../Config/tsconfig.json'),
        User        = require('../MongoSchemes/users');

/*************/
/* functions */
/*************/

/* slat to crypt password */
let salt = bcrypt.genSaltSync(10);

/* register new user */
let registerUser = function(req, res) {
    if (req.user.role !== 'admin' && req.user.role !== 'cashier') {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        User.findOne({$or : [{ username : req.body.user.username }, { email : req.body.user.email }]}, function(err, user) { //
            if (user) {
                res.send({status: false, message : 'username and/or email already exist' });
            } else {
                let user = new User({
                    email       : req.body.user.email.toLowerCase(),
                    password    : bcrypt.hashSync(req.body.user.password, salt),
                    username    : req.body.user.username.toLowerCase(),
                    firstName   : req.body.user.firstName,
                    lastName    : req.body.user.lastName,
                    sex         : req.body.user.sex,
                    registerDate: new Date(),
                    birthDay    : req.body.user.birthDay,
                    nationality : req.body.user.nationality,
                    phone       : {
                        value       : req.body.user.phone.value,
                        kind        : req.body.user.phone ? req.body.user.phone.kind : null,
                    },
                    address     : req.body.user.address,
                    isLocked    : {
                        value: false,
                    },
                    pin         : {
                        value       : req.body.user.pinCode ? req.body.user.pinCode : 'ffff',
                        tryCounter  : 3,
                        tryLimit    : 3,
                    },
                    accounts		:[{
                        label	: 'cash',
                        counter	: 0,
                        balance : 0,
                        limit	: 999999999999,
                        backup	: 0,

                    }, {
                        label	: 'bonus',
                        counter	: 0,
                        balance : 0,
                        limit	: 999999999999,
                        backup	: 0,
                    }],
                    role        : req.user.role === 'cashier' ? 'player' : req.body.user.role,
                    isDeleted: false
                });
                user.save(function(err, user) {
                    if (err) {
                        res.send({ status: false, message: 'registration failed'});
                    } else {
                        res.send({ status: true, message : 'registration succeeded', user: user });
                    }
                });
            }
        })
    }
};

/* login user */

let loginUser = function(req, res) {
    User.findOne({$or : [{ username : req.body.username }, { email : req.body.email }]}, function(err, resp) {
        if (!err && resp) {
            if (!bcrypt.compareSync(req.body.password, resp.password)) {
                res.status(403).send({status: false, message: "invalid email and/or password"});
            } else if (resp.isLocked.value) {
                res.status(403).send({status: false, message: "your account is locked, please ask the staff"})
            } else {
                let token   = jwt.sign({_id: resp._id, role: resp.role}, secretExpr.secret, {expiresIn: 60 * 60 * 24}); // generate new access token
                let date    = new Date();
                date.setDate(date.getDate() + 1); // set token's end of validity to 30 days from now -- days to be added value may be taken from collection securityconfigs (field: tokenExpire)
                User.updateOne({"_id": resp._id}, {$set: {"tokenSession.token": token, "tokenSession.expire": date}}, function (err) {
                    if (err)
                        console.log(err);
                });
                let user = {
                    _id         : resp._id,
                    email       : resp.email,
                    username    : resp.username,
                    firstName   : resp.firstName,
                    lastName    : resp.lastName,
                    role        : resp.role,
                    accounts    : resp.accounts,
                    tokenSession: {
                        token: token,
                        expire: date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear()
                    }
                };
                let params = {
                    endpoint    : req.path,
                    type        : 'LOGIN',
                    date        : new Date(),
                    state       : 'success',
                    message     : 'login successful',
                    errorCode   : '',
                    subjectId   : user._id
                };

                insertActivity(params);
                res.status(200).send({status: true, state: "login succeeded", user: user});
            }
        } else {
            console.log(err)
            res.status(404).send({status: false, message: "user not found"});
        }
    })
};

/* fetch user infos */

let fetchUserInfos = function(req, res) {
    if (req.user.role !== 'admin' && req.user.role !== 'cashier' && req.user.role !== 'player') {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        // check date in token before send back user info, otherwhise... logout
        User.findOne({"_id": req.user._id}, {"pin.value": 0, password: 0},function(error, response) {
            if (error) {
                res.status(403).send({status: false, message: "user not found"});
            } else if(response.isLocked.value) {
                res.status(403).send({status: false, message: "your account is locked, please go to cash desk"})
            } else {
                UserActivities.find({$or : [{"transaction.debit.id" : req.user._id}, {"transaction.credit.id" : req.user._id}]}, {endpoint: 0},function (err, activities) {
                    if (err) {
                        console.log(err);
                    } else {
                        let result = [];
                        activities.map(item => {
                            let tmp = {
                                _id: item._id,
                                date: moment(item.date).format('L HH:mm'),
                                type: item.type,
                                state: item.state,
                                transaction: item.transaction
                            };
                            result.push(tmp);
                        });
                        res.send({status: true, user: response, activities: result});
                    }
                }).sort({date: -1}).limit(50);
            }
        })
    }
};

/* logout user */

let logOutUser = function(req, res) {
    let date    = new Date();
    date.setDate(date.getDate() - 1); // set token's end of validity to 30 days from now
    User.updateOne({"_id": req.user._id}, {$set: {"tokenSession.token": "", "tokenSession.expire": date}}, function (err) {
        if (err)
            res.send({status: false, message: err});
        else {
            let params = {
                endpoint    : req.path,
                type        : 'LOGOUT',
                date        : new Date(),
                state       : 'success',
                message     : 'logout successful',
                errorCode   : '',
                subjectId   : req.user._id,
            };

            insertActivity(params);
            res.send({status: true, message: "User successfully logged out"});
        }
    })
};

/* get users */

let getUsers = function(req, res) {
    if (req.user.role !== 'admin' && req.user.role !== 'cashier') {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        let filter = req.body.filter;
        req.user.role === 'cashier' ? filter.role = 'player' : null; // in case of a cashier's requesting, fetch users with a 'player' role only
        User.find(filter, {pin: 0, password: 0, tokenSession: 0}, function(err, result) {
            if (err)
                res.status(400).send({status: false, message: err});
            else
                res.status(200).send({status: true, users: result});
        })
    }
};

/* update user */

let updateUser = function(req, res) {
    if (req.user.role !== 'admin' && req.user.role !== 'cashier') {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        let filter = req.body.filter;
        req.user.role === 'cashier' ? filter.role = 'player' : null; // in case of a cashier's requesting, only update user with a 'player' role
        let update = req.body.update;
        req.user.role === 'cashier' ? update.role ? delete update.role : null : null; // prevent the case of a cashier updating user's role
        update.isLocked ? delete update.isLocked : null;
        update.pin ? delete update.pin : null;
        update.accounts ? delete update.accounts : null;
        User.updateOne(filter, {$set: update}, function(err) {
            if (err) {
                console.log(err)
                res.status(400).send({ status: false, message: err });
            }else {
                res.status(200).send({ status: true, message: "user successfully updated" });
            }
        })
    }
};

/* change user's password */

let changePassword = function(req, res) {
    if (req.user.role !== 'admin' && req.user.role !== 'cashier') {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        let filter = req.body.filter;
        req.user.role === 'cashier' ? filter.role = 'player' : null; // in case of a cashier's requesting, only update user with a 'player' account
        User.findOne(filter, {"pin.value": 0}, function(error, resp) {
            if (error || !resp) {
                res.status(400).send({ status: false, message: "user not found" })
            } else {
                let password = bcrypt.hashSync(req.body.update.password, salt);
                if (password === resp.password)
                    res.status(403).send({status: false, message: "new password should not be same as old password"});
                else {
                    User.updateOne(filter, {$set: {password: password}}, function(err) {
                        if (err) {
                            res.status(400).send({ status: false, message: err });
                        } else {
                            res.status(200).send({ status: true, message: "password successfully updated" });
                        }
                    })
                }
            }
        })
    }
};

let deleteUser = function(req, res) {
    if (req.user.role !== 'admin') {
        res.status(403).send({status: false, message: 'access denied'});
    } else {
        User.findOneAndUpdate({"_id": req.body._id}, {$set: {isDeleted: true}}, function(err) {
            if (err)
                res.status(400).send({status: false, message: err});
            else
                res.status(200).send({status: true, message: "user successfully deleted"});
        })
    }
};

module.exports = {
    fetchUserInfos,
    registerUser,
    loginUser,
    logOutUser,
    getUsers,
    updateUser,
    deleteUser,
    changePassword
};

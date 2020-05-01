/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');

/************************/
/* import local modules */
/************************/

const fetchUserInfos    = require('../ApiControllers/user').fetchUserInfos;
const registerUser      = require('../ApiControllers/user').registerUser;
const logOutUser        = require('../ApiControllers/user').logOutUser;
const loginUser         = require('../ApiControllers/user').loginUser;


/***************/
/* init router */
/***************/

let router = express.Router();

/**********************/
/* User's Controllers */
/**********************/

/* register */

router.post('/register', registerUser);

/* login */

router.post('/login', loginUser);

/* logout */

router.get('/logout', logOutUser);

/* fetch user's Infos */

router.get('/fetchUserInfos', fetchUserInfos);

module.exports = router;

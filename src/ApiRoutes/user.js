/************************************/
/* import modules from node_modules */
/************************************/

const express = require('express');


/************************/
/* import local modules */
/************************/

const registerUser      = require('../ApiControllers/user').registerUser;
const loginUser         = require('../ApiControllers/user').loginUser;
const logOutUser        = require('../ApiControllers/user').logOutUser;
const fetchUserInfos    = require('../ApiControllers/user').fetchUserInfos;
const getUsers          = require('../ApiControllers/user').getUsers;
const updateUser        = require('../ApiControllers/user').updateUser;
const deleteUser        = require('../ApiControllers/user').deleteUser;
const changePassword    = require('../ApiControllers/user').changePassword;

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

/* fetch user's Infos */

router.get('/fetchUserInfos', fetchUserInfos);

/* logout */

router.get('/logout', logOutUser);

/* get users */

router.post('/get', getUsers);

/* update user */

router.post('/update', updateUser);

/* safe delete user */

router.post('/delete', deleteUser);

/* change user's password */

router.post('/password', changePassword);

module.exports = router;

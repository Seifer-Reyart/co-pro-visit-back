/************************************/
/* import modules from node_modules */
/************************************/
const   express     = require('express'),
        cors        = require('cors'),
        //fs		= require('fs'),
        //https		= require('https'),
        bodyParser  = require('body-parser');
const { resolve }   = require("path");

/************************/
/* import local modules */
/************************/
const jwt           = require('./ApiConfig/jwtHandler');
const errorHandler  = require('./ApiConfig/errorHandler');
const mongoose      = require('./ApiConfig/mongoose');

/************************/
/* start mongoDB engine */
/************************/

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('DB Connection error : ', err);
    process.exit(1);
});

db.once('open', function() {
    console.log('DB Connection succeeded on mongodb://localhost:27017/CO-PRO-VISIT');
});

/*************************/
/* Configure Api serveur */
/*************************/

const app = express();

/* // setUp environement // */
const port      = process.env.NODE_ENV === 'production' ? 3010 : 3011;
const domain    = process.env.NODE_ENV === 'production' ? 'https://34.ip-54-37-157.eu' : 'localhost';

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended : true, limit : '5mb' }));
app.use(cors());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, Authorization');

    next();
});

/* Json Web Token Authentication */
app.use(jwt());

/* Server Error Handler */
app.use(errorHandler);

/**************/
/* Api Routes */
/**************/


/* Routes */

let userRoute = require('./ApiRoutes/user');

app.use('/user', userRoute);


/*******************/
/*** Http config ***/
/*******************/

app.listen(port, () => {
    console.log(`server is listening on "${domain}:${port}"`);
});

/********************/
/*** Https config ***/
/********************/

/*
const options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};

const server = https.createServer(options, app).listen(port, () => {
  console.log(`Connected to ${port} at ${new Date()}`);
});
*/

/* initial route */

app.get('/', async (request, response) => {
    //response.setHeader('Content-Type', 'text/plain', 'charset=UTF-8');
    response.send(`Welcome to CO-PRO-VISIT API - "${domain}:${port}"`)
});
/************************************/
/* import modules from node_modules */
/************************************/
require('dotenv').config();
const   express     = require('express'),
        cors        = require('cors'),
        fs			= require('fs'),
        https		= require('https'),
        http        = require('http'),
        bodyParser  = require('body-parser');

/************************/
/* import local modules */
/************************/
const jwt           = require('./src/Config/helperBackend');
const errorHandler  = require('./src/Config/errorHandler');
const mongoose      = require('./src/Config/mongoose');
const Config 		= require('./src/Config/Config');

/************************/
/* start mongoDB engine */
/************************/

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('DB Connection error : ', err);
    process.exit(1);
});

//module.exports = db;

/************************/
/* Configure Api server */
/************************/

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '3.0.0',
        },
        host: 'localhost:3001',
        basePath: '/',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "bearer token",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./src/ApiRoutes/*.js'] //Path to the API handle folder
};
expressSwagger(options);

/* // setUp environement // */
//const port = process.env.NODE_ENV = 'production' ? 3001 : 3001;
const serverIp   = Config.HttpServer.ip;
const serverPort = Config.HttpServer.port;

//app.enable('view cache');
app.use('/uploads', express.static(`${__dirname}/uploads`));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended : true, limit : '5mb' }));
app.use(cors());

/* Json Web Token Authentication */
app.use(jwt());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, Authorization');

    next();
});

/* Server Error Handler */
//app.use(errorHandler);

/**************/
/* Api Routes */
/**************/

/* initial route */

app.get('/', async (request, response) => {

    response.setHeader('Content-Type', 'text/plain', 'charset=UTF-8');
    response.send(`backend server is listening on port : ${serverPort}`)
});

/* Routes */
let auth        = require('./src/ApiRoutes/auth');
let create      = require('./src/ApiRoutes/create');
let update      = require('./src/ApiRoutes/update');

app.use('/auth', auth);
app.use('/create', create);
app.use('/update', update);

/***********************************************************/
/* start Api backend server and listen the network traffic */
/***********************************************************/
/*
https.createServer({
    key		: fs.readFileSync('./Certificates/server.key'),
    cert	: fs.readFileSync('./Certificates/server.cert')
},
    app)
    .listen(serverPort, serverIp, (err) => {
        if (err) {
            return console.log('something bad happened', err)
        }

        console.log(`server is listening on port: ${serverPort}`)
    });
*/

app.listen(serverPort, serverIp, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on port: ${serverPort}`)
});

/* 404 API CallBack */

app.use(function(req, res, next){
    // server response encoding type
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8') ;
    // server respond with error message in case of '404 not found' error
    res.status(404).send('Page not found - request aborted') ;
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = require("./config");
var socket_1 = require("./socket");
var mqttclient_1 = __importDefault(require("./mqttclient"));
var Logging_1 = __importDefault(require("./library/Logging"));
var Device_1 = __importDefault(require("./routes/Device"));
var DeviceData_1 = __importDefault(require("./routes/DeviceData"));
var body_parser_1 = __importDefault(require("body-parser"));
// const connectToDB = require('./db/db');
var cors_1 = __importDefault(require("cors"));
// import proxyheaders from './setupProxy';
// import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
var port = config_1.config.server.port;
var host = config_1.config.server.host;
var mongo_url = 'mongodb://127.0.0.1:27017/genxiot';
//const mongo_url = 'mongodb://0.0.0.0:27017/genxiot';//?authSource=admin';// config.mongo.url //+ "/"+ config.mongo.db_name;
// CORS is enabled for the selected origins
var router = (0, express_1.default)();
var whitelist = ["http://localhost"];
// var corsOptions = {
//     origin: '*', // 'http://genxiot.com',
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//     credentials : true
//   }
router.use((0, cors_1.default)());
// router.use(cors(option));
router.set('view engine', 'ejs');
router.use(body_parser_1.default.urlencoded({ extended: false }));
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // auth: {
    //   username: 'admin',
    //   password: 'password'
    // }
};
var dbConnected;
// Connect to MongoDB
function connectDB() {
    console.log('connecting to mongodb...');
    mongoose_1.default.connect('mongodb://askadmin:askinfosys@mongodb:27017/genxiot?authMechanism=DEFAULT&authSource=admin', options).then(function () {
        console.log('Connected to MongoDB');
        StartServer();
    }).catch(function (err) {
        console.error(err);
    });
}
setTimeout(function () {
    console.log('Connect to MongoDB.');
    connectDB();
}, 10000);
/** Only Start Server if Mongoose Connects */
var StartServer = function () {
    /** Log the request */
    router.use(function (req, res, next) {
        /** Log the req */
        Logging_1.default.info("Incomming - METHOD: [".concat(req.method, "] - URL: [").concat(req.url, "] - IP: [").concat(req.socket.remoteAddress, "]"));
        res.on('finish', function () {
            /** Log the res */
            Logging_1.default.info("Result - METHOD: [".concat(req.method, "] - URL: [").concat(req.url, "] - IP: [").concat(req.socket.remoteAddress, "] - STATUS: [").concat(res.statusCode, "]"));
        });
        next();
    });
};
StartServer();
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
// Enable all CORS requests
router.use((0, cors_1.default)({
    origin: '*'
}));
// Enable CORS for specific domains only
// router.use(cors({
//   origin: 'https://www.genxiot.com'
// }));
// // Set CORS headers for specific route
// router.options('/socket.io', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.sendStatus(200);
// });
// Enable CORS with custom options
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
router.use('/api/devices', (0, cors_1.default)(), Device_1.default);
router.use('/api/devicedata', (0, cors_1.default)(), DeviceData_1.default);
/** Healthcheck */
router.get('/api/ping', function (req, res, next) { return res.status(200).json({ message: 'pong' }); });
/** Error handling */
router.use(function (req, res, next) {
    Logging_1.default.warning("URL : ".concat(req.url));
    var error = new Error('Route Not found');
    Logging_1.default.error(error);
    res.status(404).json({
        message: error.message
    });
});
var httpServer = http_1.default.createServer(router);
/** Start Socket */
new socket_1.ServerSocket(httpServer);
httpServer.listen(port, function () {
    Logging_1.default.info("Server is running ".concat(host, ":").concat(port));
    Logging_1.default.info("http://".concat(host, ":").concat(port));
    (0, mqttclient_1.default)();
});

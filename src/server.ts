import express from 'express';
import http from 'http';
import mongoose, { ConnectOptions } from 'mongoose';
import { config, DB } from './config';
import configuration from 'config';
import { ServerSocket } from './socket';
import { Server } from 'socket.io';
import mqttclient from './mqttclient';
import Logging from './library/Logging';
import deviceRoutes from './routes/Device';
import deviceDataRoutes from './routes/DeviceData';
import bodyParser from 'body-parser';
// const connectToDB = require('./db/db');
import cors from 'cors';
import { allow } from 'joi';
interface CustomConnectOptions extends ConnectOptions {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  }
// import proxyheaders from './setupProxy';
// import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
const port = config.server.port;
const host = config.server.host;
const mongo_url = 'mongodb://127.0.0.1:27017/genxiot'
//const mongo_url = 'mongodb://0.0.0.0:27017/genxiot';//?authSource=admin';// config.mongo.url //+ "/"+ config.mongo.db_name;
// CORS is enabled for the selected origins
const router = express();
const whitelist = ["http://localhost"]

// var corsOptions = {
//     origin: '*', // 'http://genxiot.com',
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//     credentials : true
//   }
router.use(cors());

// router.use(cors(option));
router.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({ extended: false }));
const options: CustomConnectOptions  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // auth: {
    //   username: 'admin',
    //   password: 'password'
    // }
  };
let dbConnected
// Connect to MongoDB
function connectDB() {
    console.log('connecting to mongodb...');
  
    mongoose.connect('mongodb://askadmin:askinfosys@mongodb:27017/genxiot?authMechanism=DEFAULT&authSource=admin', options
).then(() => {
  console.log('Connected to MongoDB');
  StartServer();
}).catch((err) => {
  console.error(err);
});
  }
  
  setTimeout(() => {
    console.log('Connect to MongoDB.');
    connectDB();
  }, 10000);
  




/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });
  }
    StartServer();
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());
    // Enable all CORS requests
    router.use(cors({
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
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }

  next();
});
    router.use('/api/devices', cors(), deviceRoutes); 
    router.use('/api/devicedata',cors(),  deviceDataRoutes);

    /** Healthcheck */
    router.get('/api/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /** Error handling */
    router.use((req, res, next) => {
        Logging.warning(`URL : ${req.url}`);
        const error = new Error('Route Not found');

        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    const httpServer = http.createServer(router);

    /** Start Socket */
    new ServerSocket(httpServer);

    httpServer.listen(port,  () => {
        Logging.info(`Server is running ${host}:${port}`);
        Logging.info(`http://${host}:${port}`);

        mqttclient();
        
    });


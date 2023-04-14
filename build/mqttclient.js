"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DevicesDB_1 = require("./db/DevicesDB");
var config_1 = __importDefault(require("config"));
var logger_1 = __importDefault(require("./utils/logger"));
var processHelpers_1 = require("./helpers/processHelpers");
// import { sendData } from './socket';
var Logging_1 = __importDefault(require("./library/Logging"));
var mqtt = require('mqtt');
var EVENTS = {
    connection: 'connection'
};
function mqttclient() {
    var port = config_1.default.get('mqttport');
    var host = 'http://128.199.19.252'; //config.get<string>('mqtthost');
    var username = config_1.default.get('mqttUsername');
    var password = config_1.default.get('mqttPassword');
    var clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4);
    var clientCode = 'SBF0001';
    var connectUrl = 'mqtt://mosquitto:1883'; //`mqtt://${host}:${port}`;
    logger_1.default.info("URL : " + connectUrl + " Username : " + username + " Pass : " + password);
    var client = mqtt.connect(connectUrl, {
        clientId: clientId,
        clean: 'false',
        connectTimeout: 4000,
        username: 'ask',
        password: 'info',
        reconnectPeriod: 100
    });
    var topicName = 'askdevicedata/#';
    var cc = '';
    logger_1.default.info("MQTT enabled : ");
    logger_1.default.info("MQTT enabled : " + client);
    // connect to same client and subscribe to same topic name
    client.on("connect", function (connack) {
        console.log("client connected", connack);
        logger_1.default.info("Inside MQTT connect");
        // can also accept objects in the form {'topic': qos}
        client.subscribe(topicName, function (err, granted) {
            if (err) {
                logger_1.default.info(err, 'err');
            }
            logger_1.default.info(granted, 'granted');
        });
    });
    // on receive message event, log the message to the console
    client.on('message', function (topic, message, packet) {
        Logging_1.default.info('Topic : ' + topic + ' , Payload : ' + message);
        var v = topic.split('/');
        if (v[0] === 'askdevicedata') {
            //logger.info(JSON.parse(message));
            (0, DevicesDB_1.saveDeviceData)(v[1], clientCode, topic, message);
            (0, processHelpers_1.processIncomingData)(topic, message).then(function (cc) {
                //logger.info(cc);
                //sendData(cc!, message);
                Logging_1.default.info('Device Data received!!!');
            });
        }
    });
    client.on('packetsend', function (packet) {
        logger_1.default.info(packet, 'packet2');
    });
    client.on('offline', function () {
        logger_1.default.info("offline");
        client.end(true, function () {
            mqttclient();
        });
    });
}
exports.default = mqttclient;

import { saveDeviceData } from './db/DevicesDB';
import { nanoid } from 'nanoid';

import config from 'config';
import logger from './utils/logger';
import { processIncomingData } from './helpers/processHelpers';
// import { sendData } from './socket';
import Logging from './library/Logging';

const mqtt = require('mqtt');
const EVENTS = {
    connection: 'connection'
};

function mqttclient() {
    const port = config.get<number>('mqttport');
    const host = 'http://128.199.19.252' //config.get<string>('mqtthost');
    const username = config.get<string>('mqttUsername');
    const password = config.get<string>('mqttPassword');
    const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4);
    const clientCode = 'SBF0001';
    const connectUrl = 'mqtt://mosquitto:1883'; //`mqtt://${host}:${port}`;
    logger.info("URL : " + connectUrl + " Username : " + username + " Pass : " + password);
    const client = mqtt.connect(connectUrl, {
        clientId : clientId,
        clean: 'false',
        connectTimeout: 4000,
        username: 'ask',
        password: 'info',
        reconnectPeriod: 100
    });

    
    const topicName = 'askdevicedata/#';
    let cc: string = '';

    logger.info(`MQTT enabled : ` );
    logger.info(`MQTT enabled : ` + client);

    // connect to same client and subscribe to same topic name
    client.on("connect",  function(connack: any){   
            console.log("client connected", connack); 
       
        logger.info(`Inside MQTT connect`);
        // can also accept objects in the form {'topic': qos}
        client.subscribe(topicName, (err: any, granted: any) => {
            if (err) {
                logger.info(err, 'err');
            }
            logger.info(granted, 'granted')
        });
    });

    // on receive message event, log the message to the console
    client.on('message', (topic: string, message: string, packet: { payload: { toString: () => any } }) => {
        Logging.info('Topic : ' + topic + ' , Payload : ' + message);
        let v = topic.split('/');
        if (v[0] === 'askdevicedata') {
            //logger.info(JSON.parse(message));

            saveDeviceData(v[1],clientCode, topic, message);
            processIncomingData(topic, message).then((cc) => {
                //logger.info(cc);
                //sendData(cc!, message);
                Logging.info('Device Data received!!!');
            });
        }
    });
    client.on('packetsend', (packet: any) => {
        logger.info(packet, 'packet2');
    });
    client.on('offline', () => {
        logger.info ("offline");
        client.end(true, () => {
            mqttclient();
        });
    });
}

export default mqttclient;

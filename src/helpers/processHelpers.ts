import { Moment } from 'moment';
// import { logger } from 'pino';
//import { getClientCode, updateTimeStamp } from './../db/DevicesDB';
import Logger from '../utils/logging';
//import mongoose from 'mongoose';
import { getClientCodeFromDeviceId, getDevicesById, saveDeviceData, updateTimeStamp } from '../db/DevicesDB';
// import{readDeviceByDeviceId} from '../controllers/Device';
import moment from 'moment';
import { ServerSocket } from '../socket';
import {IDevice} from '../models/Device';
import { IDeviceData } from '../models/DeviceData';
import { log } from 'console';
const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter { };

const myEmitter = new Emitter();
myEmitter.on('alarms', (msg: string, fileName: string) => logEvents(msg, fileName));
const extractTimeStamp = (data: string) => {
    let json = JSON.parse(data);
    let ts = json.timestamp;
    const dateTime = moment(ts * 1000).format('YYYY-MM-DD[T]HH:mm:ss');

    // Logger.info('extractTimestamp', 'Time Stamp', dateTime);
    return dateTime;
};

const FormClientMessage = (deviceId: string, lastUpdated: string) => {
    let jsonObj = {
        deviceId: deviceId,
        lastUpdated: lastUpdated
    };

    return JSON.stringify(jsonObj);
};

export const processIncomingData = async (topic: string, message: string) => {
    const { ObjectId } = require('mongodb');
    
    let v = topic.split('/');
    if (v[0] === 'askdevicedata') {
        var device_id = v[1];
        // Logger.info('ProcessHelper', 'Device ID....................................................... : ', device_id);
        var clientCode = await getClientCodeFromDeviceId(device_id);
        /** UnComment when Data from Device needs to be saved. Commented for development */
        if (!clientCode){
            clientCode="SBF0001";
        }
        // Logger.info('ProcessHelper', 'Reveived Message : ', JSON.parse(message));
        // Logger.info('ProcessHelper', 'Client ID : ', clientCode);
        let tsData = extractTimeStamp(message);
        updateTimeStamp(device_id, tsData);
        let dataTimeStamp = {};
        let str = '{"' + device_id + '":"' + tsData + '"}';
        // Logger.info('ProcessHelper', 'TimeStamp string : ', str);
        dataTimeStamp = JSON.parse(str);
        // Logger.info('ProcessHelper', 'TimeStamp object : ', dataTimeStamp);
        // saveDeviceData(device_id, clientCode!, topic, JSON.parse(message));
        // let isClientOnline = CheckIfClientIsOnline(clientCode!);
        // if (isClientOnline) {
        //     let clientMessage = FormClientMessage(device_id, tsData);
        //     sendClientData(clientCode!, clientMessage);
        //     let isDeviceOnline = CheckIfDeviceIsOnline(device_id);
        //     if (isDeviceOnline) {
        //         sendDeviceData(device_id!, message);
        //     }
        // }
        const deviceData : IDeviceData = JSON.parse(message);
        console.log("Data Received : ", deviceData);
        
        // CheckForAlarm(clientCode!, device_id,deviceData);
        ServerSocket.PrepareMessage(clientCode!, device_id, dataTimeStamp, JSON.parse(message));
        return clientCode;
    }
    return '';
};

const CheckForAlarm = async (clientCode:string, deviceId : string, deviceData:IDeviceData) =>
{
    const deviceTemp :any | null = await getDevicesById(clientCode,deviceId);
    if (!deviceTemp) {
        const device:IDevice = deviceTemp;
        CheckAnalogParams(device,deviceData);
        CheckDigitalParams(device,deviceData);
    }
}
const CheckAnalogParams = async (device: IDevice , deviceData: IDeviceData) =>{
    const mappedVal = Object.keys(device.analog_params).map((key) => {
        const param = device.analog_params[key];
        const name = param.an_name;
        const setValue = param.set_value;
        const highAlarm = param.alarm_on_high;
        const highAlarmValue = param.high_alarm_value;
        const alertOnHigh = param.alert_on_high;
        const highAlertValue= param.high_alert_value;
        const lowlow = param.lowLow;
        const low = param.low;
        const alarmOnLow= param.alarm_on_low;
        const lowAlarmValue = param.low_alarm_value;
        const alertOnLow = param.alert_on_low;
        const lowAlertValue = param.low_alert_value;
console.log("Mapped Values : ", mappedVal);

        const rData = Object.keys(deviceData.payload).map((key1) =>{
            if (param.toString() === deviceData.payload[key1].toString()){
                const valParam = deviceData.payload[key1];
                const val = deviceData.payload[valParam];
                if (alertOnHigh){
                    if (parseInt(val) > highAlertValue.valueOf()){
                        myEmitter.emit('alerts', `Param ${param.toString()} Value : ${val} is greater than High Alert Value which is ${highAlertValue.valueOf()} `, 'alerts.txt');
                        return;
                    }
                }
                if (highAlarm){
                    if (parseInt(val) > highAlarmValue.valueOf()){
                        myEmitter.emit('alarms', `Param ${param.toString()} Value : ${val} is greater than High Alarm Value which is ${highAlarmValue.valueOf()} `, 'alarms.txt');
                        return;
                    }
                }
               
                if (alertOnLow){
                    if (parseInt(val) > lowAlertValue.valueOf()){
                        myEmitter.emit('alerts', `Param ${param.toString()} Value : ${val} is lower than Low Alert Value which is ${lowAlertValue.valueOf()} `, 'alerts.txt');
                        return;
                    }
                }
                if (alarmOnLow){
                    if (parseInt(val) < lowAlarmValue.valueOf()){
                        myEmitter.emit('alarms', `Param ${param.toString()} Value : ${val} is lower than Low Alarm Value which is ${lowAlarmValue.valueOf()} `, 'alarms.txt');
                        return;
                    }
                }
            }

            });
        })
    }
const CheckDigitalParams = async (device: IDevice , deviceData: IDeviceData) =>{
    const mappedVal = Object.keys(device.digital_params).map((key) => {
        const param = device.digital_params[key];
        const alertOnHigh = param.alert_on_high;
        const alarmOnHigh = param.alarm_on_high;
        const alertOnLow = param.alert_on_low;
        const alarmOnLow = param.alarm_on_low;
        
        console.log("Digital mapped values : ", mappedVal);
        
        const rData = Object.keys(deviceData.payload).map((key1) =>{
            if (param.toString() === deviceData.payload[key1].toString()){
                const valParam = deviceData.payload[key1];
                const val = deviceData.payload[valParam];
                if (alertOnHigh){
                    if (Boolean(val) === true){
                        myEmitter.emit('alerts', `Param ${param.toString()} is High`, 'alerts.txt');
                        return;
                    }
                }
                if (alarmOnHigh){
                    if (Boolean(val) === true){
                        myEmitter.emit('alarm', `Param ${param.toString()} is High`, 'alarms.txt');
                        return;
                    }
                }
               
                if (alertOnLow){
                    if (Boolean(val) === false){
                        myEmitter.emit('alerts', `Param ${param.toString()} is Low`, 'alerts.txt');
                        return;
                    }
                }
                if (alarmOnLow){
                    if (Boolean(val) === false){
                        myEmitter.emit('alarms', `Param ${param.toString()} is Low `, 'alarms.txt');
                        return;
                    }
                }
            }

            });
        })
    }

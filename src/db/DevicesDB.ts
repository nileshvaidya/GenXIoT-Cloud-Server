import { nanoid } from 'nanoid';
import mongoose, { Types } from 'mongoose';
//import DeviceTypeMaster from "../models/DeviceTypeMaster";
import Device from '../models/Device';
//import Wingspan_Devices from "../models/Wingspan_Devices";
import DeviceData from '../models/DeviceData';
// import AnalogParameterDetails from "../models/AnalogParameterDetails";
// import DigitalParameterDetails from "../models/DigitalParameterDetails";
import logger from '../utils/logger';
import moment from 'moment';
import Logging from '../library/Logging';

// Function 1 : Get Devices Master Data [input param : clientCode ] [output param : devices[]]
export const getDevices = async (client_Code: string) => {
    const devices = await Device.find({ client_Code });
    if (!devices) {
        return null;
    } else {
        logger.info('Clientcode : ' + client_Code + ' Devices : ' + devices.length);
        return devices;
    }
};

// Function 2 : Get Device Master Data [input param : clientCode, Device_id] [output param : device]
export const getDevicesById = async (client_Code: string, device_Id: string) => {
    const filterQuery = { $and: [{ device_Id }, { client_Code }] };
    const device = await Device.findOne(filterQuery);
    if (!device) {
        return null;
    } else {
        logger.info('Clientcode : ' + client_Code + ' Device : ' + JSON.stringify(device));
        return device;
    }
};

// Function 2 : Get Client Code DeviceMaster [input param : clientCode, Device_id] [output param : device]
export const getClientCodeFromDeviceId = async (device_Id: any) => {
    const filterQuery = { device_Id: { $eq: device_Id } };
    const device = await Device.findOne(filterQuery);
    if (!device) {
        return null;
    } else {
        //logger.info('Clientcode : ' + device.clientcode + ' for Device ID : ' + device);
        return device.clientcode;
    }
};

// Function 3 : Get Device Type [input param : Device_Type_id] [output param : deviceType]

// Function 4 : Get WingspanDeviceInfo from WingspanDevices [input param : Device_id] [output param : WingspanDevice]

// Function 5 : Get Analog Param Details from AnalogParamDetailsTable [input param : Param_id] [output param : AnalogParamInfo]

// Function 6 : Get Digital Param Details from DigitalParamDetailsTable [input param : Device_id] [output param : DigitalParamInfo]

// Function 7 : Save DeviceData [input param : topic , Payload, timestamp] [output param : action_status]
export const saveDeviceData = async (device_Id: string, clientcode: string, topic: string, payload: string) => {
    try {
        var deviceData = new DeviceData({ device_Id: `${device_Id}`, clientcode: `${clientcode}`, topic: `${topic}`, payload: JSON.parse(payload) });
        Logging.info('Device_Id : ' + device_Id);
        deviceData._id instanceof mongoose.Schema.Types.ObjectId;
        deviceData.save(function (err, deviceData) {
            if (err) {
                Logging.error('Error occurred while saving devicedata : ' + err);
                return;
            }
            logger.info("Device Data : " + deviceData + " -  Saved at : " + moment.now());
        });
    } catch (error) {
        Logging.error('Error occurred while saving devicedata : ' + error);
    }
};

export const updateTimeStamp = (device_Id: string, timestamp: string) => {
    const filterQuery = { device_Id: { $eq: device_Id } };
    Logging.info('Device To Update : ' + device_Id);
    Logging.info('lastUpdated : ' + timestamp);
    Device.updateOne(filterQuery, { lastUpdated: timestamp }, function (err: any, docs: any) {
        if (err) {
            Logging.error(err);
        } else {
            Logging.info('TimeStamp Updated : ' + JSON.stringify(docs));
        }
    });
};

// Function 8 : Save Device [input param : device] [output param : action_status]
// export const saveDevice = async () => {
//     try {
//         var newDevice = new DevicesMaster({
//             name: 'Bldg 2 B',
//             device_type_id: '62d82a1f227fb33f99a0f250',
//             clientCode: 'SB005HG',
//             locationCode: '62c26a9d5b17c276a35b6f46',
//             appCode: '1',
//             fetchFrequency: 5,
//             isActive: true,
//             alarmOn: true,
//             alertOn: true,
//             createdBy: 'nilesh3',
//             createdOn: '2022-06-22T11:16:55.615+00:00',
//             updatedOn: '2022-06-22T11:16:55.615+00:00'
//         });

//         newDevice._id instanceof mongoose.Schema.Types.ObjectId;
//         newDevice.save(function (err, device) {
//             if (err) {
//                 logger.error('Error occurred while saving device : ' + err);
//                 return;
//             }
//             logger.info('Device Saved at : ' + moment.now());
//             return;
//         });
//     } catch (error) {
//         logger.error('Error occurred while saving device : ' + error);
//     }
// };

import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import mongoose from 'mongoose';
import Logging from '../library/Logging';
import DeviceData from '../models/DeviceData';

const createDeviceData = (req: Request, res: Response, next: NextFunction) => {
    const { device_Id, client_Id, topic, timestamp_event, payload } = req.body;

    const devicedata = new DeviceData({
        _id: new mongoose.Types.ObjectId(),
        device_Id,
        client_Id,
        topic,
        timestamp_event,
        payload
    });

    return devicedata
        .save()
        .then((devicedata) => res.status(201).json({ devicedata }))
        .catch((error) => res.status(500).json({ error }));
};

const readDeviceDataByClientID = (req: Request, res: Response, next: NextFunction) => {
    const client_Id = req.params.clientId;

    return DeviceData.findById(client_Id)
        .populate('deviceDate')
        .then((deviceData) => (deviceData ? res.status(200).json({ deviceData }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};
const readAllDeviceData = (req: Request, res: Response, next: NextFunction) => {};

const readDeviceDataByDeviceID = async (req: Request, res: Response, next: NextFunction) => {
    const device_Id = req.params.device_Id;
    const filter: any = { device_Id: { device_Id } };
    Logging.info(filter);
    return await DeviceData.findOne({
        $or: [{ device_Id: { $regex: device_Id } }]
    })
        .sort({ updatedAt: -1 })
        //.limit(1)
        // return await DeviceData.findOne(
        //     { filter }
        //     // {
        //     //     sort: { updatedAt: -1 }
        //     // }
        // )
        .exec()

        .then((deviceData) => (deviceData ? res.status(200).json({ deviceData }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error: error.message }));
};

const readHistoricalDeviceDataByDeviceIDVariableName = async (req: Request, res: Response, next: NextFunction) => {
    const device_Id = req.params.device_Id;
    Logging.info('Device Id : ' + JSON.stringify(device_Id));
    const total_minutes = req.params.minutes;
    Logging.info('Minutes : ' + JSON.stringify(total_minutes));
    Logging.info('Minutes : ' + moment().unix());
    const minutestodisplay = moment().unix() * 1000 - Number(total_minutes);
    Logging.info('Minutes to Display : ' + minutestodisplay);
    const filter: any = { device_Id: { $eq: device_Id } };
    Logging.info('Filter  : ' + JSON.stringify(filter));
    return await DeviceData.find({
        $and: [
            { device_Id: { $regex: device_Id } },
            // {
            //     'payload.timestamp': { $gt: minutestodisplay }
            // }
        ]
    })

        .limit(300)
        // return await DeviceData.findOne(
        //     { filter }
        //     // {
        //     //     sort: { updatedAt: -1 }
        //     // }
        // )
        .exec()

        .then((deviceData) => (deviceData ? res.status(200).json({ deviceData }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error: error.message }));
};
// async function findMostRecent(device_Id:string) {

//     const bucket = await DeviceData.findOne(
//         {},
//         {
//             sort: { updatedAt: -1 },
//             projection: { updatedAt: 1 }
//         }
//     );

//     if (!bucket) return;

//     return db.collection('weather').findOne({
//         timestamp: bucket.control.max.timestamp
//     });
// }

export default { createDeviceData, readDeviceDataByClientID, readDeviceDataByDeviceID, readHistoricalDeviceDataByDeviceIDVariableName };

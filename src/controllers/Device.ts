import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Logging from '../library/Logging';
import Device from '../models/Device';

const createDevice = (req: Request, res: Response, next: NextFunction) => {
    Logging.info(req.body);
    const { device_Id, clientcode, name, location, dataFrequency, added, lastUpdated, isActive, alarms_active, alerts_active, analog_params, digital_params } = req.body;
    Logging.info(analog_params);
    const device = new Device({
        // _id: new mongoose.Types.ObjectId(),
        device_Id,
        clientcode,
        name,
        location,
        dataFrequency,
        added,
        lastUpdated,
        isActive,
        alarms_active,
        alerts_active,
        analog_params,
        digital_params
    });

    device.markModified(req.body.analog_params);
    Logging.info(device);
    return device
        .save()
        .then((device) => res.status(201).json({ device }))
        .catch((error) => res.status(500).json({ error }));
};

const readDeviceByDeviceId = (req: Request, res: Response, next: NextFunction) => {
    const device_Id = req.params.deviceId;
    const filter: any = { device_Id: { $eq: device_Id } };
    return Device.findOne(filter)
        .populate({ path: 'devices', strictPopulate: false })
        .then((device) => (device ? res.status(200).json({ device }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readDevicesByCliendID = (req: Request, res: Response, next: NextFunction) => {
    const clientcode = req.params.clientcode;

    const filter: any = { clientcode: { $eq: clientcode } };
    Logging.warning(filter);
    return Device.find()//filter)
        .populate({ path: 'devices', strictPopulate: false })
        .then((device) => (device ? res.status(200).json({ device }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error: error.message }));
};

export default { readDeviceByDeviceId, readDevicesByCliendID, createDevice };

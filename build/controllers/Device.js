"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logging_1 = __importDefault(require("../library/Logging"));
var Device_1 = __importDefault(require("../models/Device"));
var createDevice = function (req, res, next) {
    Logging_1.default.info(req.body);
    var _a = req.body, device_Id = _a.device_Id, clientcode = _a.clientcode, name = _a.name, location = _a.location, dataFrequency = _a.dataFrequency, added = _a.added, lastUpdated = _a.lastUpdated, isActive = _a.isActive, alarms_active = _a.alarms_active, alerts_active = _a.alerts_active, analog_params = _a.analog_params, digital_params = _a.digital_params;
    Logging_1.default.info(analog_params);
    var device = new Device_1.default({
        // _id: new mongoose.Types.ObjectId(),
        device_Id: device_Id,
        clientcode: clientcode,
        name: name,
        location: location,
        dataFrequency: dataFrequency,
        added: added,
        lastUpdated: lastUpdated,
        isActive: isActive,
        alarms_active: alarms_active,
        alerts_active: alerts_active,
        analog_params: analog_params,
        digital_params: digital_params
    });
    device.markModified(req.body.analog_params);
    Logging_1.default.info(device);
    return device
        .save()
        .then(function (device) { return res.status(201).json({ device: device }); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
};
var readDeviceByDeviceId = function (req, res, next) {
    var device_Id = req.params.deviceId;
    var filter = { device_Id: { $eq: device_Id } };
    return Device_1.default.findOne(filter)
        .populate({ path: 'devices', strictPopulate: false })
        .then(function (device) { return (device ? res.status(200).json({ device: device }) : res.status(404).json({ message: 'not found' })); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
};
var readDevicesByCliendID = function (req, res, next) {
    var clientcode = req.params.clientcode;
    var filter = { clientcode: { $eq: clientcode } };
    Logging_1.default.warning(filter);
    return Device_1.default.find() //filter)
        .populate({ path: 'devices', strictPopulate: false })
        .then(function (device) { return (device ? res.status(200).json({ device: device }) : res.status(404).json({ message: 'not found' })); })
        .catch(function (error) { return res.status(500).json({ error: error.message }); });
};
exports.default = { readDeviceByDeviceId: readDeviceByDeviceId, readDevicesByCliendID: readDevicesByCliendID, createDevice: createDevice };

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var mongoose_1 = __importDefault(require("mongoose"));
var Logging_1 = __importDefault(require("../library/Logging"));
var DeviceData_1 = __importDefault(require("../models/DeviceData"));
var createDeviceData = function (req, res, next) {
    var _a = req.body, device_Id = _a.device_Id, client_Id = _a.client_Id, topic = _a.topic, timestamp_event = _a.timestamp_event, payload = _a.payload;
    var devicedata = new DeviceData_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        device_Id: device_Id,
        client_Id: client_Id,
        topic: topic,
        timestamp_event: timestamp_event,
        payload: payload
    });
    return devicedata
        .save()
        .then(function (devicedata) { return res.status(201).json({ devicedata: devicedata }); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
};
var readDeviceDataByClientID = function (req, res, next) {
    var client_Id = req.params.clientId;
    return DeviceData_1.default.findById(client_Id)
        .populate('deviceDate')
        .then(function (deviceData) { return (deviceData ? res.status(200).json({ deviceData: deviceData }) : res.status(404).json({ message: 'not found' })); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
};
var readAllDeviceData = function (req, res, next) { };
var readDeviceDataByDeviceID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var device_Id, filter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                device_Id = req.params.device_Id;
                filter = { device_Id: { device_Id: device_Id } };
                Logging_1.default.info(filter);
                return [4 /*yield*/, DeviceData_1.default.findOne({
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
                        .then(function (deviceData) { return (deviceData ? res.status(200).json({ deviceData: deviceData }) : res.status(404).json({ message: 'not found' })); })
                        .catch(function (error) { return res.status(500).json({ error: error.message }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var readHistoricalDeviceDataByDeviceIDVariableName = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var device_Id, total_minutes, minutestodisplay, filter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                device_Id = req.params.device_Id;
                Logging_1.default.info('Device Id : ' + JSON.stringify(device_Id));
                total_minutes = req.params.minutes;
                Logging_1.default.info('Minutes : ' + JSON.stringify(total_minutes));
                Logging_1.default.info('Minutes : ' + (0, moment_1.default)().unix());
                minutestodisplay = (0, moment_1.default)().unix() * 1000 - Number(total_minutes);
                Logging_1.default.info('Minutes to Display : ' + minutestodisplay);
                filter = { device_Id: { $eq: device_Id } };
                Logging_1.default.info('Filter  : ' + JSON.stringify(filter));
                return [4 /*yield*/, DeviceData_1.default.find({
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
                        .then(function (deviceData) { return (deviceData ? res.status(200).json({ deviceData: deviceData }) : res.status(404).json({ message: 'not found' })); })
                        .catch(function (error) { return res.status(500).json({ error: error.message }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
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
exports.default = { createDeviceData: createDeviceData, readDeviceDataByClientID: readDeviceDataByClientID, readDeviceDataByDeviceID: readDeviceDataByDeviceID, readHistoricalDeviceDataByDeviceIDVariableName: readHistoricalDeviceDataByDeviceIDVariableName };

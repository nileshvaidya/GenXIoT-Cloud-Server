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
exports.updateTimeStamp = exports.saveDeviceData = exports.getClientCodeFromDeviceId = exports.getDevicesById = exports.getDevices = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
//import DeviceTypeMaster from "../models/DeviceTypeMaster";
var Device_1 = __importDefault(require("../models/Device"));
//import Wingspan_Devices from "../models/Wingspan_Devices";
var DeviceData_1 = __importDefault(require("../models/DeviceData"));
// import AnalogParameterDetails from "../models/AnalogParameterDetails";
// import DigitalParameterDetails from "../models/DigitalParameterDetails";
var logger_1 = __importDefault(require("../utils/logger"));
var moment_1 = __importDefault(require("moment"));
var Logging_1 = __importDefault(require("../library/Logging"));
// Function 1 : Get Devices Master Data [input param : clientCode ] [output param : devices[]]
var getDevices = function (client_Code) { return __awaiter(void 0, void 0, void 0, function () {
    var devices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Device_1.default.find({ client_Code: client_Code })];
            case 1:
                devices = _a.sent();
                if (!devices) {
                    return [2 /*return*/, null];
                }
                else {
                    logger_1.default.info('Clientcode : ' + client_Code + ' Devices : ' + devices.length);
                    return [2 /*return*/, devices];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getDevices = getDevices;
// Function 2 : Get Device Master Data [input param : clientCode, Device_id] [output param : device]
var getDevicesById = function (client_Code, device_Id) { return __awaiter(void 0, void 0, void 0, function () {
    var filterQuery, device;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filterQuery = { $and: [{ device_Id: device_Id }, { client_Code: client_Code }] };
                return [4 /*yield*/, Device_1.default.findOne(filterQuery)];
            case 1:
                device = _a.sent();
                if (!device) {
                    return [2 /*return*/, null];
                }
                else {
                    logger_1.default.info('Clientcode : ' + client_Code + ' Device : ' + JSON.stringify(device));
                    return [2 /*return*/, device];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getDevicesById = getDevicesById;
// Function 2 : Get Client Code DeviceMaster [input param : clientCode, Device_id] [output param : device]
var getClientCodeFromDeviceId = function (device_Id) { return __awaiter(void 0, void 0, void 0, function () {
    var filterQuery, device;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filterQuery = { device_Id: { $eq: device_Id } };
                return [4 /*yield*/, Device_1.default.findOne(filterQuery)];
            case 1:
                device = _a.sent();
                if (!device) {
                    return [2 /*return*/, null];
                }
                else {
                    //logger.info('Clientcode : ' + device.clientcode + ' for Device ID : ' + device);
                    return [2 /*return*/, device.clientcode];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getClientCodeFromDeviceId = getClientCodeFromDeviceId;
// Function 3 : Get Device Type [input param : Device_Type_id] [output param : deviceType]
// Function 4 : Get WingspanDeviceInfo from WingspanDevices [input param : Device_id] [output param : WingspanDevice]
// Function 5 : Get Analog Param Details from AnalogParamDetailsTable [input param : Param_id] [output param : AnalogParamInfo]
// Function 6 : Get Digital Param Details from DigitalParamDetailsTable [input param : Device_id] [output param : DigitalParamInfo]
// Function 7 : Save DeviceData [input param : topic , Payload, timestamp] [output param : action_status]
var saveDeviceData = function (device_Id, clientcode, topic, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceData;
    return __generator(this, function (_a) {
        try {
            deviceData = new DeviceData_1.default({ device_Id: "".concat(device_Id), clientcode: "".concat(clientcode), topic: "".concat(topic), payload: JSON.parse(payload) });
            Logging_1.default.info('Device_Id : ' + device_Id);
            deviceData._id instanceof mongoose_1.default.Schema.Types.ObjectId;
            deviceData.save(function (err, deviceData) {
                if (err) {
                    Logging_1.default.error('Error occurred while saving devicedata : ' + err);
                    return;
                }
                logger_1.default.info("Device Data : " + deviceData + " -  Saved at : " + moment_1.default.now());
            });
        }
        catch (error) {
            Logging_1.default.error('Error occurred while saving devicedata : ' + error);
        }
        return [2 /*return*/];
    });
}); };
exports.saveDeviceData = saveDeviceData;
var updateTimeStamp = function (device_Id, timestamp) {
    var filterQuery = { device_Id: { $eq: device_Id } };
    Logging_1.default.info('Device To Update : ' + device_Id);
    Logging_1.default.info('lastUpdated : ' + timestamp);
    Device_1.default.updateOne(filterQuery, { lastUpdated: timestamp }, function (err, docs) {
        if (err) {
            Logging_1.default.error(err);
        }
        else {
            Logging_1.default.info('TimeStamp Updated : ' + JSON.stringify(docs));
        }
    });
};
exports.updateTimeStamp = updateTimeStamp;
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

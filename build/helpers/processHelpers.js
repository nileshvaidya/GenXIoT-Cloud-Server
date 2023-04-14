"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.processIncomingData = void 0;
//import mongoose from 'mongoose';
var DevicesDB_1 = require("../db/DevicesDB");
// import{readDeviceByDeviceId} from '../controllers/Device';
var moment_1 = __importDefault(require("moment"));
var socket_1 = require("../socket");
var logEvents = require('./logEvents');
var EventEmitter = require('events');
var Emitter = /** @class */ (function (_super) {
    __extends(Emitter, _super);
    function Emitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Emitter;
}(EventEmitter));
;
var myEmitter = new Emitter();
myEmitter.on('alarms', function (msg, fileName) { return logEvents(msg, fileName); });
var extractTimeStamp = function (data) {
    var json = JSON.parse(data);
    var ts = json.timestamp;
    var dateTime = (0, moment_1.default)(ts * 1000).format('YYYY-MM-DD[T]HH:mm:ss');
    // Logger.info('extractTimestamp', 'Time Stamp', dateTime);
    return dateTime;
};
var FormClientMessage = function (deviceId, lastUpdated) {
    var jsonObj = {
        deviceId: deviceId,
        lastUpdated: lastUpdated
    };
    return JSON.stringify(jsonObj);
};
var processIncomingData = function (topic, message) { return __awaiter(void 0, void 0, void 0, function () {
    var ObjectId, v, device_id, clientCode, tsData, dataTimeStamp, str, deviceData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ObjectId = require('mongodb').ObjectId;
                v = topic.split('/');
                if (!(v[0] === 'askdevicedata')) return [3 /*break*/, 2];
                device_id = v[1];
                return [4 /*yield*/, (0, DevicesDB_1.getClientCodeFromDeviceId)(device_id)];
            case 1:
                clientCode = _a.sent();
                /** UnComment when Data from Device needs to be saved. Commented for development */
                if (!clientCode) {
                    clientCode = "SBF0001";
                }
                tsData = extractTimeStamp(message);
                (0, DevicesDB_1.updateTimeStamp)(device_id, tsData);
                dataTimeStamp = {};
                str = '{"' + device_id + '":"' + tsData + '"}';
                // Logger.info('ProcessHelper', 'TimeStamp string : ', str);
                dataTimeStamp = JSON.parse(str);
                deviceData = JSON.parse(message);
                console.log("Data Received : ", deviceData);
                // CheckForAlarm(clientCode!, device_id,deviceData);
                socket_1.ServerSocket.PrepareMessage(clientCode, device_id, dataTimeStamp, JSON.parse(message));
                return [2 /*return*/, clientCode];
            case 2: return [2 /*return*/, ''];
        }
    });
}); };
exports.processIncomingData = processIncomingData;
var CheckForAlarm = function (clientCode, deviceId, deviceData) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceTemp, device;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, DevicesDB_1.getDevicesById)(clientCode, deviceId)];
            case 1:
                deviceTemp = _a.sent();
                if (!deviceTemp) {
                    device = deviceTemp;
                    CheckAnalogParams(device, deviceData);
                    CheckDigitalParams(device, deviceData);
                }
                return [2 /*return*/];
        }
    });
}); };
var CheckAnalogParams = function (device, deviceData) { return __awaiter(void 0, void 0, void 0, function () {
    var mappedVal;
    return __generator(this, function (_a) {
        mappedVal = Object.keys(device.analog_params).map(function (key) {
            var param = device.analog_params[key];
            var name = param.an_name;
            var setValue = param.set_value;
            var highAlarm = param.alarm_on_high;
            var highAlarmValue = param.high_alarm_value;
            var alertOnHigh = param.alert_on_high;
            var highAlertValue = param.high_alert_value;
            var lowlow = param.lowLow;
            var low = param.low;
            var alarmOnLow = param.alarm_on_low;
            var lowAlarmValue = param.low_alarm_value;
            var alertOnLow = param.alert_on_low;
            var lowAlertValue = param.low_alert_value;
            console.log("Mapped Values : ", mappedVal);
            var rData = Object.keys(deviceData.payload).map(function (key1) {
                if (param.toString() === deviceData.payload[key1].toString()) {
                    var valParam = deviceData.payload[key1];
                    var val = deviceData.payload[valParam];
                    if (alertOnHigh) {
                        if (parseInt(val) > highAlertValue.valueOf()) {
                            myEmitter.emit('alerts', "Param ".concat(param.toString(), " Value : ").concat(val, " is greater than High Alert Value which is ").concat(highAlertValue.valueOf(), " "), 'alerts.txt');
                            return;
                        }
                    }
                    if (highAlarm) {
                        if (parseInt(val) > highAlarmValue.valueOf()) {
                            myEmitter.emit('alarms', "Param ".concat(param.toString(), " Value : ").concat(val, " is greater than High Alarm Value which is ").concat(highAlarmValue.valueOf(), " "), 'alarms.txt');
                            return;
                        }
                    }
                    if (alertOnLow) {
                        if (parseInt(val) > lowAlertValue.valueOf()) {
                            myEmitter.emit('alerts', "Param ".concat(param.toString(), " Value : ").concat(val, " is lower than Low Alert Value which is ").concat(lowAlertValue.valueOf(), " "), 'alerts.txt');
                            return;
                        }
                    }
                    if (alarmOnLow) {
                        if (parseInt(val) < lowAlarmValue.valueOf()) {
                            myEmitter.emit('alarms', "Param ".concat(param.toString(), " Value : ").concat(val, " is lower than Low Alarm Value which is ").concat(lowAlarmValue.valueOf(), " "), 'alarms.txt');
                            return;
                        }
                    }
                }
            });
        });
        return [2 /*return*/];
    });
}); };
var CheckDigitalParams = function (device, deviceData) { return __awaiter(void 0, void 0, void 0, function () {
    var mappedVal;
    return __generator(this, function (_a) {
        mappedVal = Object.keys(device.digital_params).map(function (key) {
            var param = device.digital_params[key];
            var alertOnHigh = param.alert_on_high;
            var alarmOnHigh = param.alarm_on_high;
            var alertOnLow = param.alert_on_low;
            var alarmOnLow = param.alarm_on_low;
            console.log("Digital mapped values : ", mappedVal);
            var rData = Object.keys(deviceData.payload).map(function (key1) {
                if (param.toString() === deviceData.payload[key1].toString()) {
                    var valParam = deviceData.payload[key1];
                    var val = deviceData.payload[valParam];
                    if (alertOnHigh) {
                        if (Boolean(val) === true) {
                            myEmitter.emit('alerts', "Param ".concat(param.toString(), " is High"), 'alerts.txt');
                            return;
                        }
                    }
                    if (alarmOnHigh) {
                        if (Boolean(val) === true) {
                            myEmitter.emit('alarm', "Param ".concat(param.toString(), " is High"), 'alarms.txt');
                            return;
                        }
                    }
                    if (alertOnLow) {
                        if (Boolean(val) === false) {
                            myEmitter.emit('alerts', "Param ".concat(param.toString(), " is Low"), 'alerts.txt');
                            return;
                        }
                    }
                    if (alarmOnLow) {
                        if (Boolean(val) === false) {
                            myEmitter.emit('alarms', "Param ".concat(param.toString(), " is Low "), 'alarms.txt');
                            return;
                        }
                    }
                }
            });
        });
        return [2 /*return*/];
    });
}); };

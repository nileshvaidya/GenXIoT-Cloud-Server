"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var AnalogueParameterSchema = new mongoose_1.Schema({
    an_name: { type: String, required: true },
    set_value: { type: Number },
    highHigh: { type: Number },
    high: { type: Number },
    alarm_on_high: { type: Boolean },
    high_alarm_value: { type: Number },
    alert_on_high: { type: Boolean },
    high_alert_value: { type: Number },
    lowLow: { type: Number },
    low: { type: Number },
    alarm_on_low: { type: Boolean },
    low_alarm_value: { type: Number },
    alert_on_low: { type: Boolean },
    low_alert_value: { type: Number }
});
mongoose_1.default.model('analogue_Params', AnalogueParameterSchema, 'analogue_Params');
var DigitalParameterSchema = new mongoose_1.Schema({
    di_name: { type: String, required: true },
    set_value: { type: Boolean },
    alert_on_high: { type: Boolean },
    alarm_on_high: { type: Boolean },
    alert_on_low: { type: Boolean },
    alarm_on_low: { type: Boolean }
});
mongoose_1.default.model('digital_Params', DigitalParameterSchema, 'digital_Params');
var DeviceSchema = new mongoose_1.Schema({
    device_Id: { type: String, required: true },
    clientcode: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String },
    dataFrequency: { type: Number },
    added: { type: Date },
    lastUpdated: { type: Date },
    isActive: { type: Boolean },
    alarms_active: { type: Boolean },
    alerts_active: { type: Boolean },
    analog_params: [AnalogueParameterSchema],
    digital_params: [DigitalParameterSchema]
});
exports.default = mongoose_1.default.model('devices', DeviceSchema);

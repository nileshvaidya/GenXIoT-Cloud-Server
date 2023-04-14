import mongoose, { Document, Schema } from 'mongoose';

/**Analog Parameters Schema Interface */
export interface IAnalogueParameter {
    an_name: string;
    set_value: Number;
    highHigh: Number;
    high: Number;
    alarm_on_high: Boolean;
    high_alarm_value: Number;
    alert_on_high: Boolean;
    high_alert_value: Number;
    lowLow: Number;
    low: Number;
    alarm_on_low: Boolean;
    low_alarm_value: Number;
    alert_on_low: Boolean;
    low_alert_value: Number;
}
//export interface IDeviceDataModel extends IDeviceData, Document {}
/** Digital Parameter Schema Interface */
export interface IDigitalParameter {
    di_name: string;
    set_value: boolean;
    alert_on_high: boolean;
    alarm_on_high: boolean;
    alert_on_low: boolean;
    alarm_on_low: boolean;
}

export interface IDevice {
    device_Id: string;
    clientcode: string;
    name: string;
    location: string;
    dataFrequency: Number;
    added: Date;
    lastUpdated: Date;
    isActive: Boolean;
    alarms_active: Boolean;
    alerts_active: Boolean;
    analog_params: {
        [key: string]: IAnalogueParameter;
    };
    digital_params: {
        [key: string]: IDigitalParameter;
    };
}

export interface IDeviceModel extends IDevice, Document {}

const AnalogueParameterSchema = new Schema({
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
mongoose.model('analogue_Params', AnalogueParameterSchema, 'analogue_Params');

const DigitalParameterSchema = new Schema({
    di_name: { type: String, required: true },
    set_value: { type: Boolean },
    alert_on_high: { type: Boolean },
    alarm_on_high: { type: Boolean },
    alert_on_low: { type: Boolean },
    alarm_on_low: { type: Boolean }
});
mongoose.model('digital_Params', DigitalParameterSchema, 'digital_Params');

const DeviceSchema: Schema = new Schema({
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

export default mongoose.model<IDevice>('devices', DeviceSchema);

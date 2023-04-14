import mongoose, { Document, Schema } from 'mongoose';

export interface IDeviceData {
    device_Id: string;
    clientcode: string;
    topic: string;
    timestamp_event: string;
    payload: {
        [key: string]: string; 
      };
    }

export interface IDeviceDataModel extends IDeviceData, Document {}

const DeviceDataSchema: Schema = new Schema(
    {
        device_Id: { type: String, required: true },
        clientcode: { type: String, required: true },
        topic: { type: String, required: true },
        payload: { type: Object, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IDeviceData>('devicedatas', DeviceDataSchema);

import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const DeviceSchema: Schema = new Schema({
  deviceId: {
    type: Number,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  macAddress: {
    type: String,
    required: true,
  },
  belongTo: {
    type: Number,
    required: true,
  },
});

type Device = InferSchemaType<typeof DeviceSchema>;

const DeviceModel: Model<Device> = mongoose.model('Device', DeviceSchema);

export default DeviceModel;

import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const DeviceSchema: Schema = new Schema({
  deviceId: {
    type: Number,
    required: true,
  },
  macAddress: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  belongTo: {
    type: Number,
    required: true,
  },
});

const Device: Model<InferSchemaType<typeof DeviceSchema>> = mongoose.model(
  'Device',
  DeviceSchema,
);

export default Device;

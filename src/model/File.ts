import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const FileSchema: Schema = new Schema({
  fileId: {
    type: Number,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  md5: {
    type: String,
    required: true,
  },
  belongTo: {
    type: Number,
    required: true,
  },
  chunks: {
    type: [Number],
  },
  lastUpdate: {
    type: Number,
  },
});

const File: Model<InferSchemaType<typeof FileSchema>> = mongoose.model(
  'File',
  FileSchema,
);

export default File;

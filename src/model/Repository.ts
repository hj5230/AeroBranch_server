import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const RepoSchema: Schema = new Schema({
  repoId: {
    type: Number,
    required: true,
  },
  repoName: {
    type: String,
    required: true,
  },
  belongTo: {
    type: Number,
    required: true,
  },
  files: {
    type: [Number],
  },
  repoDesp: {
    type: String
  },
  lastUpdate: {
    type: Number,
  },
  lastUpdateFrom: {
    type: Number,
  },
  snapshotOf: {
    type: Number,
  },
});

const Repository: Model<InferSchemaType<typeof RepoSchema>> = mongoose.model(
  'Repository',
  RepoSchema,
);

export default Repository;

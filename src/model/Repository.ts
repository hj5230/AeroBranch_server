import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const StructSchema: Schema = new Schema(
    {
        isDir: {
            type: Boolean,
            required: true,
        },
        dirName: {
            type: String,
            required: true,
        },
        children: {
            type: [this],
        },
        fileId: {
            type: Number,
        },
    },
    { _id: false },
);

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
    descripion: {
        type: String,
    },
    structure: {
        type: [StructSchema],
    },
    repoDesp: {
        type: String,
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
    "Repository",
    RepoSchema,
);

export default Repository;

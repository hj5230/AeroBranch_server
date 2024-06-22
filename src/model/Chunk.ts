import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ChunkSchema: Schema = new Schema({
    chunkId: {
        type: Number,
        required: true,
    },
    chunkNo: {
        type: Number,
        required: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    belongTo: {
        type: Number,
        required: true,
    },
});

const Chunk: Model<InferSchemaType<typeof ChunkSchema>> = mongoose.model(
    "Chunk",
    ChunkSchema,
);

export default Chunk;

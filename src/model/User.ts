import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const UserSchema: Schema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  devices: {
    type: [Number],
    required: true,
  },
  repositories: {
    type: [Number],
  },
});

// UserSchema.methods = {
//   getUserId(): number {
//     return this.userId;
//   },
//   getUsername(): string {
//     return this.username;
//   },
//   async comparePassword(password: string): Promise<boolean> {
//     return await bcrypt.compare(password, this.password);
//   },
//   getDevices(): number[] {
//     return this.devices;
//   },
//   getRepos(): number[] {
//     return this.repositories;
//   },
// };

const User: Model<InferSchemaType<typeof UserSchema>> = mongoose.model(
  'User',
  UserSchema,
);

export default User;

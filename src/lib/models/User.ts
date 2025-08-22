import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  emailVerified: { type: Date },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

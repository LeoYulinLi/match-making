import * as mongoose from "mongoose";
import { Document, model } from "mongoose";

const Schema = mongoose.Schema
const String = mongoose.Schema.Types.String

interface IUser {
  username: string,
  password: string,
  apiKey: string
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
})

const User = model<IUser & Document>("User", UserSchema)

export default User

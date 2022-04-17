import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
})

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', UserSchema); 
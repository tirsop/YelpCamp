import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  body: String,
  rating: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('Review', reviewSchema); 
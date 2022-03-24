import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number
})

export default mongoose.model('Review', reviewSchema); 
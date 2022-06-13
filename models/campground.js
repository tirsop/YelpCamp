import mongoose from "mongoose";
import Review from './review.js';                // import mongoose model created inside models folder

const CampgroundSchema = new mongoose.Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

//Deletes all reviews of a campground when you delete a campground
CampgroundSchema.post('findOneAndDelete', async function (campground) {
  if (campground) {
    await Review.deleteMany({ _id: { $in: campground.reviews } })
  }
})

export default mongoose.model('Campground', CampgroundSchema); 
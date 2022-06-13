import mongoose from "mongoose";
import Review from './review.js';                // import mongoose model created inside models folder

// video 544: getting a 200px img using the cloudinary API
const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String
});
// it does NOT allow arrow functions in the line below
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new mongoose.Schema({
  title: String,
  images: [ImageSchema],
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
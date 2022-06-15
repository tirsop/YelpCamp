import mongoose from "mongoose";
import Review from './review.js';                // import mongoose model created inside models folder

// video 544: getting a 200px img using the cloudinary API
const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String
});
ImageSchema.virtual('thumbnail').get(function () {      // it does NOT allow arrow functions 
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };  // video558: to include the virtuals when jsonstringify the object

const CampgroundSchema = new mongoose.Schema({
  title: String,
  images: [ImageSchema],
  geometry: { // video 547
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
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
}, opts);

// video558: virtual containing the map popup text
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 70)}...</p>
  `
})

//Deletes all reviews of a campground when you delete a campground
CampgroundSchema.post('findOneAndDelete', async function (campground) {
  if (campground) {
    await Review.deleteMany({ _id: { $in: campground.reviews } })
  }
})

export default mongoose.model('Campground', CampgroundSchema); 
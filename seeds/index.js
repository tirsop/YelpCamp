console.log(`\n\n\n\n\n\n\n\n\n
******************************************************************`);
import 'dotenv/config';

import cities from './cities.js';
import { descriptors, places } from './seedHelpers.js';
import mongoose from "mongoose";
import Campground from '../models/campground.js';                // import mongoose model created inside models folder
import User from '../models/user.js';                // import mongoose model created inside models folder
const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl)
  .then(() => {
    console.log(`--------------console.log\nDatabase connected\n`)
  })
  .catch(err => {
    console.log(`--------------console.log\nMONGO CONNECTION ERROR:`)
    console.log(err + `\n`)
  })

const imagesUrls = [
  {
    url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081514/YelpCamp/hpoptulcxtgxlxrhabrf.jpg",
    filename: "YelpCamp/hpoptulcxtgxlxrhabrf"
  },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081514/YelpCamp/xknjukpbfx3vowtz5pi6.jpg", filename: "YelpCamp/xknjukpbfx3vowtz5pi6" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081514/YelpCamp/fqmkvra5dsjdquahixn8.jpg", filename: "YelpCamp/fqmkvra5dsjdquahixn8" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081514/YelpCamp/fmdv7j3kcrjou8raswry.jpg", filename: "YelpCamp/fmdv7j3kcrjou8raswry" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081514/YelpCamp/xagsnju4wijovdmeu0sa.jpg", filename: "YelpCamp/xagsnju4wijovdmeu0sa" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081514/YelpCamp/ke8bxqifjuq4alzio9ce.jpg", filename: "YelpCamp/ke8bxqifjuq4alzio9ce" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081514/YelpCamp/fzb897y5qwaxuvtpgrwc.jpg", filename: "YelpCamp/fzb897y5qwaxuvtpgrwc" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081515/YelpCamp/shamlinwetlp5vy5lban.jpg", filename: "YelpCamp/shamlinwetlp5vy5lban" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081515/YelpCamp/rz5rvwjqozw3mp1fwzv9.jpg", filename: "YelpCamp/rz5rvwjqozw3mp1fwzv9" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081515/YelpCamp/mbs7zvwmx95uoipyywzb.jpg", filename: "YelpCamp/mbs7zvwmx95uoipyywzb" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081516/YelpCamp/aitdkydvgk9ptu76kwcm.jpg", filename: "YelpCamp/aitdkydvgk9ptu76kwcm" },
  { url: "https://res.cloudinary.com/tirsopascual/image/upload/v1655081515/YelpCamp/co0zhwgwn8e4o1f1iug5.jpg", filename: "YelpCamp/co0zhwgwn8e4o1f1iug5" }
];

// function that returns a random element of an array
const sample = array => array[Math.floor(Math.random() * array.length)];

// first delete was is inside the db, and then randomly generates seeds from 2 external files
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 20; i++) {     // 20 bc I want 20 seeds
    const random1000 = Math.floor(Math.random() * 1000)      // Generates a random number from 0 to 1000. 1000 bc there are 1000 cities in cities.js
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '62a1362ceac5d7756516ee2b',          // choose an existing user id depending on production or development!!!
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description: 'Beautivul camp in the side bank of a RTCRtpReceiver, and there are bears so be carefult because thy are strolling around and they may surprise you and eat you bitch.',
      price,
      images: [
        sample(imagesUrls),
        sample(imagesUrls)
      ]
    })
    await camp.save();
    console.log('...');
  }
}
seedDB().then(() => {
  mongoose.connection.close();
});


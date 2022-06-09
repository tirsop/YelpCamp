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
      image: 'https://res.cloudinary.com/fleetnation/image/private/c_fit,w_1120/g_south,l_text:style_gothic2:%C2%A9%20John%20Williams,o_20,y_10/g_center,l_watermark4,o_25,y_50/v1557042400/hfnbp4wrmkipn4akocil.jpg',
      description: 'Beautivul camp in the side bank of a RTCRtpReceiver, and there are bears so be carefult because thy are strolling around and they may surprise you and eat you bitch.',
      price
    })
    await camp.save();
    console.log('...');
  }
}
seedDB().then(() => {
  mongoose.connection.close();
});


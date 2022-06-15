console.log(`\n\n\n\n\n\n\n\n\n
******************************************************************`);
import 'dotenv/config';
import cities from './cities.js';
import { descriptors, places } from './seedHelpers.js';
import mongoose from "mongoose";
import Campground from '../models/campground.js';                // import mongoose model created inside models folder
import Review from '../models/review.js';                        // import mongoose model created inside models folder
import User from '../models/user.js';                            // import mongoose model created inside models folder
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

const authors = [
  "62a92ec0bbd07df59664314b",
  "62a1362ceac5d7756516ee2b",
];
const customers = [
  "62a92edcbbd07df596643190",
  "62a92eefbbd07df5966431bf"
]
const ratings = [3, 4, 5];
const bodyReviews = [
  "The beer was really cheap from 4pm to 7pm. It was a little noisy at nights. The owner was a little scary.",
  "Sunsets here are wonderfull. Also they provide you with equipment to do your own bbqs. Overall an amazing experience that I will repeat",
  "すごかったです。みんなここに来て欲しいです。おすすめ。",
  "一目惚れしちゃった。人優しいし、食べ物美味しいし。熊いっぱいいるのでお気をつけてください。",
  "オーナーが日本語ペラペラですよ。びっくりした。たこ焼きも作れるだし。Wi-Fiちょっとないですけれども。。。",
  "Bring a bell and make noise when hiking just in case. Many bears around, specially in summer and they are hungry for honey.",
]

// first delete was is inside the db, and then randomly generates seeds from 2 external files
const seedDB = async () => {
  await Campground.deleteMany({});
  console.log("All campgrounds deleted.");
  console.log("Creating new campgrounds...");
  for (let i = 0; i < 100; i++) {     // 20 bc I want 20 seeds
    const random1000 = Math.floor(Math.random() * 1000)      // Generates a random number from 0 to 1000. 1000 bc there are 1000 cities in cities.js
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: sample(authors),          // Choose an existing user id depending on production or development!!!
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      description: `
        Located in ${cities[random1000].state}, this beautiful camp in the side bank of a ${cities[random1000].city} river, and there are bears so be careful because they are strolling around and they may surprise you and eat you.\n This campground is mangaged by a lovely old couple, commonly referred as Ojiichan and Obaachan, that can prepare delicious meals for guest under request.`,
      price,
      images: [
        sample(imagesUrls),
        sample(imagesUrls)
      ]
    })
    await camp.save();
    console.log('...');
  }
  const campgrounds = await Campground.find({});
  console.log("Creating reviews...");
  for (let campground of campgrounds) {
    const review1 = new Review({ author: customers[0], rating: sample(ratings), body: sample(bodyReviews) });
    const review2 = new Review({ author: customers[1], rating: sample(ratings), body: sample(bodyReviews) });
    campground.reviews.push(review1, review2);
    await review1.save();
    await review2.save();
    await campground.save();
    console.log('...');
  }
}
const campsTotal = await Campground.count();
seedDB().then(() => {
  mongoose.connection.close();
  console.log(`${campsTotal} campgrounds created!`);
});


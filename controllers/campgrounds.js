import { cloudinary } from '../cloudinary/index.js';
import Campground from '../models/campground.js';           // import mongoose model created inside models folder

const mapBoxToken = process.env.MAPBOX_TOKEN;
import fetch from "node-fetch";


const campgrounds = {
  index: async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  },
  newCamp: (req, res) => {
    // console.log(currentUser);
    res.render('campgrounds/new');
  },
  createCamp: async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.campground.location}.json?limit=1&access_token=${mapBoxToken}`);
    const data = await response.json();
    // console.log(data.features[0].geometry);
    if (!data.features[0]) {
      req.flash('error', 'Cannot loccate the campground. Introduce new address');
      return res.redirect('campgrounds/new');
    }
    campground.geometry = data.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    // console.log(campground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
  },
  showCamp: async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('author').populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    });     // populate camp, camp's author, camp's reviews, each review's author
    if (!campground) {
      req.flash('error', 'Cannot find that campground');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  },
  editCamp: async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Cannot edit/find that campground');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  },
  updateCamp: async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  },
  destroyCamp: async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted camp');
    res.redirect('/campgrounds');
  }
}

export default campgrounds;
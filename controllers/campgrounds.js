import Campground from '../models/campground.js';           // import mongoose model created inside models folder

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
    campground.author = req.user._id;
    await campground.save();
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
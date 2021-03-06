import Joi from 'joi';                                 // to server side validation for mongoose

const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
  }).required(),
  deleteImages: Joi.array()
})

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
})

export { campgroundSchema, reviewSchema };
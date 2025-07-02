import Joi from "joi";

const getMenuByCategoryValidation = Joi.string().valid("coffee", "non-coffee", "food").required();

const getMenuByItsAvailabilityValidation = Joi.boolean().required();

const addMenuValidation = Joi.object({
  name : Joi.string().max(100).required(),
  description : Joi.string().max(1000).required(),
  category : Joi.string().valid("coffee", "non-coffee", "food").required(),
  isAvailable : Joi.boolean().required(),
  variants : Joi.array().items(Joi.object({
    size : Joi.string().valid("small", "regular", "large").required(),
    price : Joi.number().integer().min(0).required(),
  })).required()
});

const updateMenuValidation = Joi.object({
  name : Joi.string().max(100).required(),
  description : Joi.string().max(1000).required(),
  category : Joi.string().valid("coffee", "non-coffee", "food").required(),
  isAvailable : Joi.boolean().required(),
  variants : Joi.object({
    size: Joi.string().valid("small", "medium", "large").required(),
    price: Joi.number().integer().min(0).required()
  })
});

export{
  getMenuByCategoryValidation,
  getMenuByItsAvailabilityValidation,
  addMenuValidation,
  updateMenuValidation,
}
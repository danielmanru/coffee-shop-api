import Joi from "joi";

const getMenuByCategoryValidation = Joi.string().valid("coffee", "non-coffee", "food").required();

const getMenuByItsAvailabilityValidation = Joi.boolean().required();

const getMenuByIdValidation = Joi.string().max(1000).required();

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

const deleteMenuValidation = Joi.string().max(1000).required();

const addImageValidation = Joi.object({
  menu_id: Joi.string().max(1000).required(),
  image_metadata: Joi.array().items(Joi.object(
    {
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
      size: Joi.number().max(2 * 1024 * 1024).required()
    }))
});

const deleteImageValidation = Joi.object({
  menuId: Joi.string().max(1000).required(),
  publicIds: Joi.array().items(Joi.string().max(1000).required()),
});

export{
  getMenuByCategoryValidation,
  getMenuByItsAvailabilityValidation,
  addMenuValidation,
  updateMenuValidation,
  deleteMenuValidation,
  addImageValidation,
  deleteImageValidation,
  getMenuByIdValidation
}
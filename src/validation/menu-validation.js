import Joi from "joi";

const addMenu = Joi.object({
  name : Joi.string().max(100).required(),
  description : Joi.string().max(1000).required(),
  category : Joi.string().valid("coffee", "non-coffee", "food").required(),
  isAvailable : Joi.boolean().required(),
  imageUrl : Joi.string().max(1000).required(),
  variants : Joi.object({
    size : Joi.string().valid("small", "medium", "large").required(),
    price : Joi.number().integer().min(0).required()
  })
});

const updateMenu = Joi.object({
  name : Joi.string().max(100).required(),
  description : Joi.string().max(1000).required(),
  category : Joi.string().valid("coffee", "non-coffee", "food").required(),
  isAvailable : Joi.boolean().required(),
  imageUrl : Joi.string().max(1000).required(),
  variants : Joi.object({
    size: Joi.string().valid("small", "medium", "large").required(),
    price: Joi.number().integer().min(0).required()
  })
});

const deleteMenu = Joi.object({
  _id: Joi.string().max(1000).required(),
});



export{
  addMenu,
  updateMenu,
  deleteMenu,
}
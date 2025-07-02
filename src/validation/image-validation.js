import Joi from 'joi';

const addImagesValidation = Joi.object({
  menu_id: Joi.string().max(1000).required(),
  asset_folder: Joi.string().valid('menu-assets', 'outlet-assets', 'test'),
  image_metadata: Joi.array().items(Joi.object(
    {
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
      size: Joi.number().max(2 * 1024 * 1024).required()
    }))
});

const deleteImagesValidation = Joi.object({
  menuId: Joi.string().max(1000).required(),
  publicIds: Joi.array().items(Joi.string().max(1000).required()),
});

export {
  addImagesValidation,
  deleteImagesValidation
}
import Joi from 'joi';

const addImagesValidation = Joi.object({
  document_id: Joi.string().max(1000).required(),
  model_name: Joi.string().valid('Menu', 'Outlet'),
  asset_folder: Joi.string().valid('menu-assets', 'outlet-assets'),
  image_metadata: Joi.array().items(Joi.object(
    {
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
      size: Joi.number().max(2 * 1024 * 1024).required()
    }))
});

const deleteImagesValidation = Joi.object({
  document_id: Joi.string().max(1000).required(),
  model_name: Joi.string().valid('Menu', 'Outlet'),
  publicIds: Joi.array().items(Joi.string().max(1000).required())
});

export {
  addImagesValidation,
  deleteImagesValidation
}
import Joi from "joi";

const searchOutletValidation  = Joi.string().max(1000).required();

const addAndUpdateOutletValidation = Joi.object({
  name : Joi.string().max(250).required(),
  location: Joi.object({
    alamat: Joi.string().max(250).required(),
    kelurahan:  Joi.string().max(100).required(),
    kecamatan: Joi.string().max(100).required(),
  }),
  openingHours: Joi.object({
    open : Joi.string().max(5).required(),
    close : Joi.string().max(5).required(),
  }),
  isActive: Joi.boolean(),
});

export {
  searchOutletValidation,
  addAndUpdateOutletValidation,
}
import Joi from "joi";

const idValidation = Joi.string().max(250).required();

export default idValidation;
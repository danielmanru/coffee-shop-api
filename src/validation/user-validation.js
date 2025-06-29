import Joi from "joi";

const registerUserValidation = Joi.object({
  name : Joi.string().max(100).required(),
  email: Joi.string()
    .email({tlds : { allow : true }})
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base" : "Should not contain uppercase letters!",
    }),
  password : Joi.string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
    .required()
    .messages({
      "string.pattern.base" : "Password should contain uppercase, number, and special character",
    }),
  phone : Joi.string().max(13).required(),
  role : Joi.string().valid('admin', 'staff', 'customer').required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string()
    .email({tlds : { allow : true }})
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base" : "Should not contain uppercase letters!",
    }),
  password : Joi.string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
    .required()
    .messages({
      "string.pattern.base" : "Password should contain uppercase, number, and special character",
    }),
})

const tokenValidation = Joi.string().required()

const getUserValidation = Joi.string().max(100).required()

const updateUserValidation = Joi.object({
  name : Joi.string().max(100).required(),
  phone : Joi.string().max(13).required(),
  location : Joi.object({
    address : Joi.string().required(),
    kecamatan : Joi.string().required(),
    kelurahan : Joi.string().required(),
    kota : Joi.string().required()
  })
})

const changePasswordValidation = Joi.object({
  currentPassword : Joi.string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
    .optional()
    .messages({
      "string.pattern.base" : "Password should contain uppercase, number, and special character",
    }),
  newPassword : Joi.string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
    .optional()
    .messages({
      "string.pattern.base" : "Password should contain uppercase, number, and special character",
    }),
});

const resetPasswordValidation = Joi.object({
  newPassword : Joi.string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
    .optional()
    .messages({
      "string.pattern.base" : "Password should contain uppercase, number, and special character",
    }),
  confirmNewPassword : Joi.string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
    .optional()
    .messages({
      "string.pattern.base" : "Password should contain uppercase, number, and special character",
    }),
});

const forgetPasswordValidation = Joi.object({
  email: Joi.string()
    .email({tlds : { allow : true }})
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base" : "Should not contain uppercase letters!",
    }),
})

export{
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
  changePasswordValidation,
  tokenValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
}
const Joi = require('joi');


const userRegisterValidate = (data) => {
     const userSchema = Joi.object({
          email: Joi.string().pattern(new RegExp('gmail.com$')).min(15).max(30).email().required(),
          name:  Joi.string().min(3).max(20).required(),
          password: Joi.string().min(6).max(100).required(),
     })

     return userSchema.validate(data);
}

const userLoginValidate = (data) => {
    const userSchema = Joi.object({
         email: Joi.string().pattern(new RegExp('gmail.com$')).min(15).max(30).email().required(),
         password: Joi.string().min(6).max(20).required(),
    })

    return userSchema.validate(data);
}

module.exports = {
    userRegisterValidate,
    userLoginValidate,
}
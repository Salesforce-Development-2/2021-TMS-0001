const Joi = require('joi');

const userSchema = Joi.object({

    firstname: Joi.string()
        .max(30)
        .required(),

    lastname: Joi.string()
    .max(30)
    .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    email: Joi.string()
        .email()
        .required(),
    
    role_type: Joi.string()
    .max(30)
    .required(),
})

module.exports = {
    userValidation: async function(data){
        const validation = await userSchema.validate(data);
        return validation
    }
}
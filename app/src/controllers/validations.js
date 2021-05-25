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


const assessmentSchema = Joi.object({

    scores: Joi.number()
    .max(5)
    .required(),

    assessment_type: Joi.string()
    .max(30)
    .required(),

    assessment_date: Joi.date()
    .required(),
})



module.exports = {
    userValidation: async function(data){
        const validation = await userSchema.validate(data);
        return validation
    },
    assesmentValidation: async function (data) {
        const validation = await assessmentSchema.validate(data);
        return validation
    }
}
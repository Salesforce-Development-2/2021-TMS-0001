const Joi = require("joi");

// validation rules for user model
const userSchema = Joi.object({
  firstname: Joi.string().max(30).required(),

  lastname: Joi.string().max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  email: Joi.string().email().required(),

  role: Joi.string().max(30).required(),

  batch_name: Joi.string().max(30)
});
// VALIDATION FOR COURSES MODE BEGINS HERE ###################################################################


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


const courseSchema = Joi.object({
  course_name: Joi.string().min(6).max(50).required(),
  course_master: Joi.string().min(6).max(50).required(),
  course_duration: Joi.string().required(),
});

// VALIDATION FOR COURSES MODEL ENDS HERE ####################################################################

//validation rules for track model
const trackSchema = Joi.object({
  track_name: Joi.string().max(100).required(),

  track_master: Joi.string().max(100).required(),
});
// EXPORTS
module.exports = {
  userValidation: async function (data) {
    const validation = await userSchema.validate(data);
    return validation;
  },
  // course validation export
  courseValidation: async function (data) {
    const validation = await courseSchema.validate(data);
    return validation;
  },

  trackValidation: async function (data) {
    const validation = await trackSchema.validate(data);
    return validation;
  },
  assesmentValidation: async function (data) {
    const validation = await assessmentSchema.validate(data);
    return validation
    }
};

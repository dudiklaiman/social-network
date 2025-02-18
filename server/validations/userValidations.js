import Joi from 'joi';

export const validateRegister = (reqBody) => {
    const joiSchema = Joi.object({
        name:Joi.string().min(2).max(50).required().trim(),
        email:Joi.string().max(150).email().required().trim(),
        password:Joi.string().min(4).max(16).required().trim(),
        location:Joi.string().min(2).max(30).required().trim(),
        occupation:Joi.string().min(2).max(30).required().trim(),
    });
    return joiSchema.validate(reqBody);
}

export const validateLogin = (reqBody) => {
    const joiSchema = Joi.object({
        email:Joi.string().max(150).email().required().trim(),
        password:Joi.string().min(4).max(16).required().trim(),
    });
    return joiSchema.validate(reqBody);
}

export const validateUpdate = (reqBody) => {
    const joiSchema = Joi.object({
        name:Joi.string().min(2).max(50).required().trim(),
        email:Joi.string().max(150).email().required().trim(),
        password:Joi.string().min(4).max(16).optional().allow("", null),
        location:Joi.string().min(2).max(30).required().trim(),
        occupation:Joi.string().min(2).max(30).required().trim(),
    });
    return joiSchema.validate(reqBody);
}

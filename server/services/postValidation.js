import Joi from 'joi';

export const validateCreatePost = (reqBody) => {
    const joiSchema = Joi.object({
        description:Joi.string().min(1).max(100).required(),
    })
    return joiSchema.validate(reqBody);
}

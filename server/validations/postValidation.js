import Joi from 'joi';


export const validateCreatePost = (reqBody) => {
    const joiSchema = Joi.object({
        description:Joi.string().max(1400).allow("", null),
    });
    
    return joiSchema.validate(reqBody);
}

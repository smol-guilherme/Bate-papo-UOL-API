import Joi from "joi";

const messageSchema = Joi.object({
    to: Joi.string()
        .min(1)
        .max(64)
        .required(),
    text: Joi.string()
        .min(1)
        .max(256)
        .required(),
    type: Joi.string()
        .valid("message", "private_message")
        .required()
})

export default async function validateMessage(data) {
    try {
        const response = await messageSchema.validateAsync(data, { abortEarly: false });
        return true;
    } catch(err) {
        return false;
    }
}
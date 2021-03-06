import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(64)
        .required(),
})

export default async function validateUser(user) {
    try {
        const response = await userSchema.validateAsync(user, { abortEarly: false });
        return true;
    } catch(err) {
        return false;
    }
}
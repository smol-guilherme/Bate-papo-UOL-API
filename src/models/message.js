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

// const test = {
// 	to: "Maria",
// 	text: "oi sumida rs",
// 	type: "private_essage"
// };

export default async function validateMessage(data) {
    try {
        const response = await messageSchema.validateAsync(data);
        console.log("this response", response)
        return true;
    } catch(err) {
        console.log("this err", err);
        return false;
    }
}
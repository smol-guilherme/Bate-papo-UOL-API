import Joi from "joi";

const userSchema = Joi.string().min(1).max(64).required();
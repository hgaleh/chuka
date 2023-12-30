import { Middleware } from "..";
import { validator } from ".";
import { ValidationLogic } from "./validators";

export function bodyValidator<T>(validationLogic: ValidationLogic<T, keyof T>): Middleware< { body: T }> {
    return (req, res, next) => {
        validator(validationLogic, 'body')(req, res, next);
    }
}

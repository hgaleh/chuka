import { Middleware } from "..";
import { validator } from ".";
import { ValidationLogic } from "./validators";

export function queryValidator<T>(validationLogic: ValidationLogic<T>): Middleware< { query: T }> {
    return (req, res, next) => {
        validator(validationLogic, 'query')(req, res, next);
    }
}

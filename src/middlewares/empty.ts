import { Middleware } from "..";

export function empty<T>(): Middleware<T> {
    return (req, res, next) => {
        next();
    }
}

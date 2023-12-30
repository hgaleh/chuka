import { Middleware } from "../controller";

type RequestField<F extends string, T> = {
    [k in F]: T;
}

export function validator<T, F extends string>(validationLogic: ValidationLogic<T, keyof T>, requestField: F): Middleware<RequestField<F, T>> {
    return (req, res, next) => {
        const errorObject: ErrorObject<T> = {};
        let result = true;
    
        for (const key in validationLogic) {
            const microValidator = validationLogic[key];
            if (microValidator) {

                try {
                    // @ts-ignore
                    errorObject[key] = microValidator(req[requestField]);
                } catch (err) {
                    result = false;
                }

                if (!errorObject[key]) {
                    result = false;
                }
            }
        }

        if (result) {
            next();
        } else {
            res.status(400).json(errorObject);
        }
    }
}

type ErrorObject<T> = {
    [k in keyof T]?: boolean;
}

export type ValidationLogic<T, F extends keyof T> = {
    [k in F]?: ValidationFunction<T>; 
}

type ValidationFunction<T> = (subject: T) => boolean;

export function isString<T, F extends keyof T>(field: F): ValidationFunction<T> {
    return (subj: T) => {
        return (typeof subj[field] === 'string');
    }
}

export function isNumber<T, F extends keyof T>(field: F): ValidationFunction<T> {
    return (subj: T) => {
        return (typeof subj[field] === 'number');
    }
}

export function isDefined<T, F extends keyof T>(field: F): ValidationFunction<T> {
    return (subj: T) => {
        return subj[field] != undefined;
    }
}

export function isUndefined<T, F extends keyof T>(field: F): ValidationFunction<T> {
    return (subj: T) => {
        return subj[field] === undefined;
    }
}

export function isNull<T, F extends keyof T>(field: F): ValidationFunction<T> {
    return (subj: T) => {
        return subj[field] === null;
    }
}

export function notNull<T, F extends keyof T>(field: F): ValidationFunction<T> {
    return (subj: T) => {
        return subj[field] !== null;
    }
}


export function and<T>(...validationFunctions: Array<ValidationFunction<T>>): ValidationFunction<T> {
    return (subject: T) => {
        return validationFunctions.every(validationFunction => validationFunction(subject));
    }
}

export function or<T>(...validationFunctions: Array<ValidationFunction<T>>): ValidationFunction<T> {
    return (subject: T) => {
        return validationFunctions.some(validationFunction => validationFunction(subject));
    }
}

export function not<T>(validationFunction: ValidationFunction<T>): ValidationFunction<T> {
    return (subject: T) => {
        return !validationFunction(subject);
    }
}
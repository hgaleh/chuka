import { Middleware } from '../controller';

type RequestField<F extends PropertyKey, T> = Record<F, T>;

export function validator<T, F extends PropertyKey>(validationLogic: ValidationLogic<T>, requestField: F): Middleware<RequestField<F, T>> {
    return (req, res, next) => {
        // @ts-ignore
        const errors = applyValidation(req[requestField], validationLogic);
        const result = isThereAnyErrors(errors);

        if (result) {
            next(errors);
        } else {
            next();
        }
    }
}

function applyValidation<T>(obj: T, validationLogic: ValidationLogic<T>): Partial<Record<keyof T, any>> {
    const validationResult: Partial<Record<keyof T, any>> = {};

    for (const key in validationLogic) {
        const microValidator = validationLogic[key];

        if (microValidator) {
            if (microValidator instanceof Function) {
                try {
                    validationResult[key] = microValidator(obj);
                } catch (err) {
                    validationResult[key] = false;
                }
            } else {
                if (obj[key] instanceof Array) {
                    validationResult[key] = (obj[key] as Array<any>).map(objj => applyValidation(objj, microValidator));
                } else {
                    validationResult[key] = applyValidation(obj[key], microValidator as any);
                }
            }
        } else {
            validationResult[key] = true;
        }
    }

    return validationResult;
}

function isThereAnyErrors(obj: Object): boolean {
    for (const [key, value] of Object.entries(obj)) {
        if (value === false) {
            return true;
        } else if (typeof value !== 'boolean') {
            const partialRes = isThereAnyErrors(value);
            if (partialRes) {
                return partialRes;
            }
        } 
    }
    return false;
}

type UnArray<T> = T extends Array<infer A> ? A : T;

export type ValidationLogic<T> = {
    [k in keyof T as T[k] extends Function ? never : k]?: ValidationLogic<UnArray<T[k]>> | ValidationFunction<T>; 
}

type ValidationFunction<T> = (subject: T) => boolean;

export function isString<T>(field: keyof T): ValidationFunction<T> {
    return (subj: T) => {
        return (typeof subj[field] === 'string');
    }
}

export function isNumber<T>(field: keyof T): ValidationFunction<T> {
    return (subj: T) => {
        return (typeof subj[field] === 'number');
    }
}

export function isDefined<T>(field: keyof T): ValidationFunction<T> {
    return (subj: T) => {
        return subj[field] != undefined;
    }
}

export function isUndefined<T>(field: keyof T): ValidationFunction<T> {
    return (subj: T) => {
        return subj[field] === undefined;
    }
}

export function isNull<T>(field: keyof T): ValidationFunction<T> {
    return (subj: T) => {
        return subj[field] === null;
    }
}

export function notNull<T>(field: keyof T): ValidationFunction<T> {
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
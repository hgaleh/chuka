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
        const atomicValidator = validationLogic[key];

        if (atomicValidator) {
            if (atomicValidator instanceof Validator) {
                try {
                    validationResult[key] = atomicValidator.validate(obj, key);
                } catch (err) {
                    validationResult[key] = false;
                }
            } else {
                if (obj[key] instanceof Array) {
                    validationResult[key] = (obj[key] as Array<any>).map(objj => applyValidation(objj, atomicValidator));
                } else {
                    validationResult[key] = applyValidation(obj[key], atomicValidator as any);
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
    [k in keyof T as T[k] extends Function ? never : k]?: ValidationLogic<UnArray<T[k]>> | Validator<T>; 
}

// type ValidationFunction<T> = (subject: T) => boolean;

export abstract class Validator<T> {
    abstract validate(subject: T, selectedField: keyof T): boolean;
}


class CustomValidator<T> extends Validator<T> {
    constructor(private validator: (obj: T) => boolean) {
        super();
    }

    validate(subject: T, selectedField: keyof T): boolean {
        return this.validator(subject);
    }
}

export function custom<T>(validator: (obj: T) => boolean): Validator<T> {
    return new CustomValidator(validator);
}

export class AtomicValidator<T> extends Validator<T> {
    constructor(private implementation: (subject: T | T[keyof T]) => boolean, public queryField?: keyof T) {
        super();
    }

    validate(subject: T, selectedField: keyof T): boolean {
        return this.implementation(this.queryField ? subject[this.queryField] : subject[selectedField]);
    }
}

export function isString<T>(field?: keyof T): AtomicValidator<T> {
    return new AtomicValidator((subject) => {
        return typeof subject === 'string';
    }, field);
}

export function isNumber<T>(field?: keyof T): AtomicValidator<T> {
    return new AtomicValidator((subject) => {
        return typeof subject === 'number';
    }, field);
}

export function isDefined<T>(field?: keyof T): AtomicValidator<T> {
    return new AtomicValidator((subject) => {
        return subject != undefined;
    }, field);
}

export function isUndefined<T>(field?: keyof T): AtomicValidator<T> {
    return new AtomicValidator((subject) => {
        return subject === undefined;
    }, field);
}

export function isNull<T>(field?: keyof T): AtomicValidator<T> {
    return new AtomicValidator((subject) => {
        return subject === null;
    }, field);
}

export function notNull<T>(field?: keyof T): AtomicValidator<T> {
    return new AtomicValidator((subject) => {
        return subject !== null;
    }, field);
}


class AndValidator<T> extends Validator<T> {
    private validationFunctions: Array<Validator<T>>

    constructor(...validationFunctions: Array<Validator<T>>) {
        super();
        this.validationFunctions = validationFunctions;
    }

    validate(subject: T, selectedField: keyof T): boolean {
        return this.validationFunctions.every(eachValidator => eachValidator.validate(subject, selectedField));
    }
}

class OrValidator<T> extends Validator<T> {
    private validationFunctions: Array<Validator<T>>

    constructor(...validationFunctions: Array<Validator<T>>) {
        super();
        this.validationFunctions = validationFunctions;
    }

    validate(subject: T, selectedField: keyof T): boolean {
        return this.validationFunctions.some(eachValidator => eachValidator.validate(subject, selectedField));
    }
}

class NotValidator<T> extends Validator<T> {
    private validationFunction: Validator<T>;

    constructor(validationFunctions: Validator<T>) {
        super();
        this.validationFunction = validationFunctions;
    }

    validate(subject: T, selectedField: keyof T): boolean {
        return !this.validationFunction.validate(subject, selectedField);
    }
}

export function and<T>(...validationFunctions: Array<Validator<T>>): Validator<T> {
    return new AndValidator(...validationFunctions);
}

export function or<T>(...validationFunctions: Array<Validator<T>>): Validator<T> {
    return new OrValidator(...validationFunctions);
}

export function not<T>(validationFunction: Validator<T>): Validator<T> {
    return new NotValidator(validationFunction);
}
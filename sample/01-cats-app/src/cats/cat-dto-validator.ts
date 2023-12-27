import { Middleware } from 'galeh';
import { CatModel } from './cat-model';
import codes from 'status-code-enum';

export function catDtoValidator(): Middleware<{ body: CatModel }> {
    return ({ body }, res, next) => {
        if (body && body.name && typeof body.name === 'string') {
            next();
        } else {
            res.status(codes.ClientErrorBadRequest).send('Bad request!');
        }
    }
}
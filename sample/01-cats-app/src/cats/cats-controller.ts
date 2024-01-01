import { Controller, Middleware } from 'galeh';
import { inject, injectable } from 'galeh/decorators';
import { CatsServiceInterface } from './cats-service-interface';
import { createLogger } from './create-logger';
import { and, bodyValidator, isDefined, isNumber, isString } from 'galeh/validators';
import { CatModel } from './cat-model';

@injectable()
export class CatsController extends Controller {
    constructor(@inject('catservice') service: CatsServiceInterface) {
        super();

        const intercepted = this.middleware(
            createLogger()
        );

        intercepted.middleware(
            bodyValidator<CatModel>({
                name: and(isDefined('name'), isString('name')),
                country: isNumber('country'),
                parents: {
                    name: isString('name'),
                    parents: {
                        country: isString('country')
                    }
                }
            })
        ).post('/', async (req, res) => {{       
            const allcats = await service.add(req.body.name);
            res.send(allcats);
        }});
        
        intercepted.get('/', async (req, res) => {{
            const allcats = await service.findAll();
            res.send(allcats);
        }});

        intercepted.get('/:id', async (req, res) => {
            const onecat = await service.findOne(+req.params.id);
            res.send(onecat);
        });
    }
}

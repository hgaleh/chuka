import { Controller } from 'galeh';
import { inject, injectable } from 'galeh/decorators';
import { body } from 'galeh/middlewares';
import { CatsServiceInterface } from './cats-service-interface';
import { createLogger } from './create-logger';
import { catDtoValidator } from './cat-dto-validator';

@injectable()
export class CatsController extends Controller {
    constructor(@inject('catservice') service: CatsServiceInterface) {
        super();

        const intercepted = this.middleware(createLogger());

        intercepted.middleware(
            body<{ name: string }>(),
            catDtoValidator()
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

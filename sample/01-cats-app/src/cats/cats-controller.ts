import { Controller } from 'galeh';
import { inject, injectable } from 'galeh/decorators';
import { body } from 'galeh/middlewares';
import { CatsServiceInterface } from './cats-service-interface';

@injectable()
export class CatsController extends Controller<{}> {
    constructor(@inject('catservice') service: CatsServiceInterface) {
        super();

        this.middleware(
            '/',
            body<{ name: string }>()
        ).post( async (req, res) => {{            
            const allcats = await service.add(req.body.name);
            res.send(allcats);
        }})

        this.get('/', async (req, res) => {{
            const allcats = await service.findAll();
            res.send(allcats);
        }});

        this.get('/:id', async (req, res) => {
            const onecat = await service.findOne(+req.params.id);
            res.send(onecat);
        });
    }
}

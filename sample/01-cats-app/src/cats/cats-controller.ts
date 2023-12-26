import { Controller } from 'galeh';
import { inject, injectable } from 'inversify';
import { CatsServiceInterface } from './cats-service-interface';
import { body } from 'galeh/middlewares';

@injectable()
export class CatsController extends Controller<{}> {
    constructor(@inject('catservice') service: CatsServiceInterface) {
        super();

        // @Roles(['admin'])
        // async create(@Body() createCatDto: CreateCatDto) {
        //     this.catsService.create(createCatDto);
        // }
        const bod = body<{ name: string }>();

        this.middleware(
            '/',
            bod
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

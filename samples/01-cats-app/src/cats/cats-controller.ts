import { Controller } from '@galeh/chuka';
import { inject, injectable } from '@galeh/chuka';
import { CatsServiceInterface } from './cats-service-interface';
import { createLogger } from './create-logger';
import { and, bodyValidator, isDefined, isString, custom } from '@galeh/chuka';
import { CatModel } from './cat-model';

@injectable()
export class CatsController extends Controller {
    intercepted = this.use(
        createLogger()
    );

    postCat = this.intercepted.use(
        bodyValidator<CatModel>({
            name: and(isDefined(), isString()),
            country: isString(),
            age: custom(model => Promise.resolve(!!(model.age && model.age > 0))),
            parents: {
            	name: and(isDefined(), isString())
            }
        })
    ).post('/', async (req, res) => {{
        const allcats = await this.service.add(req.body);
        res.send(allcats);
    }});

    getAllCats = this.intercepted.get('/', async (req, res) => {{
        const allcats = await this.service.findAll();
        res.send(allcats);
    }});

    getCatById = this.intercepted.get('/:id', async (req, res) => {
        const onecat = await this.service.findOne(+req.params.id);
        res.send(onecat);
    });

    constructor(@inject('catservice') private service: CatsServiceInterface) {
        super();
    }
}

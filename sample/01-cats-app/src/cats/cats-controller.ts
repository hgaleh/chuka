import { Controller } from '@galeh/chuka';
import { inject, injectable } from '@galeh/chuka/decorators';
import { CatsServiceInterface } from './cats-service-interface';
import { createLogger } from './create-logger';
import { and, bodyValidator, isDefined, isNumber, isString, custom } from '@galeh/chuka/validators';
import { CatModel } from './cat-model';

@injectable()
export class CatsController extends Controller {
    intercepted = this.middleware(
        createLogger()
    );

    postCat = this.intercepted.middleware(
        bodyValidator<CatModel>({
            name: and(isDefined(), isString()),
            country: isNumber(),
            age: custom(model => Promise.resolve(!!(model.age && model.age > 2))),
            parents: {
                name: isString(),
                parents: {
                    country: isString(),
                }
            }
        })
    ).post('/', async (req, res) => {{
        const allcats = await this.service.add(req.body.name);
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

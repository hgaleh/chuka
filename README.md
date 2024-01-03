# Purpose
This package fortifies Express.js, empowering it with strong types, dependency injection, profound validation, and a streamlined approach to simplify API programming.

# Example

```typescript
// main.ts
const app = createApp({
    dependencies: [
        {
            provide: 'catservice',
            useClass: CatsService
        }
    ],    
    routes: [
        {
            path: '/cats',
            controller: CatsController
        }
    ],
    middlewares: [
        json()
    ]
});

app.use((error: any, req: any, res: any, next: any) => {
    res.status(400).json(error);
})

app.listen(8080, () => {
    console.log('running application!');
});

```

```typescript
// example for a controller

@injectable()
export class CatsController extends Controller {
    constructor(@inject('catservice') service: CatsServiceInterface) {
        super();

        const intercepted = this.middleware(
            createLogger()
        );

        intercepted.middleware(
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

```

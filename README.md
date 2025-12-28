# @galeh/chuka

🚀 **Introducing @galeh/chuka - Empowering Express.js for Effortless API Development!**

@galeh/chuka is a powerful package designed to enhance your Express.js experience, making API development faster, stronger, and more straightforward. 🌐✨

## Key Features

- ✅ **Strong Types:** Say goodbye to runtime errors with strong typing for a more robust development experience.
- 🔄 **Dependency Injection:** Streamline your application's architecture by effortlessly injecting dependencies.
- 🔍 **Profound Validation:** Simplify data validation with expressive and comprehensive validation capabilities.

## Getting Started

```bash
npm install @galeh/chuka
```
```typescript
import { createApp, Controller, injectable, json, bodyValidator, and, isDefined, isString, isNumber, custom, inject } from '@galeh/chuka';

@injectable()
class CatsService implements CatsServiceInterface {
	private cats: CatsModel[] = [
		{
			age: 1,
			country: 'USA',
			name: 'Tom',
			parents: [
				{
					age: 2,
					country: 'Cuba',
					name: 'Daddy',
					parents: []
				},
				{
					age: 2,
					country: 'China',
					name: 'Mommy',
					parents: []
				}
			]
		}
	]

	findAll(): Promise<CatsModel[]> {
		return Promise.resolve(this.cats);
	}

	findOne(name: string): Promise<CatsModel | null> {
		return Promise.resolve(this.cats.filter(cat => cat.name === name)[0] || null);
	}

	add(cat: CatsModel): Promise<void> {
		this.cats.push(cat);
		return Promise.resolve();
	}
}

@injectable()
class CatsController extends Controller {
	private intercepted = this.use(
	);

	postCat = this.intercepted.use(
		bodyValidator<CatsModel>({
			name: and(isDefined(), isString()),
			country: isNumber(),
			age: custom(model => Promise.resolve(!!(model.age && model.age > 2))),
			parents: custom(model => Array.isArray(model.parents))
		})
	).post('/', async (req, res) => {
		{
			const allcats = await this.service.add(req.body);
			res.send(allcats);
		}
	});

	getAllCats = this.intercepted.get('/', async (req, res) => {
		{
			const allcats = await this.service.findAll();
			res.send(allcats);
		}
	});

	getCatByName = this.intercepted.get('/:name', async (req, res) => {
		const onecat = await this.service.findOne(req.params.name);
		res.send(onecat);
	});

	constructor(@inject('catservice') private service: CatsServiceInterface) {
		super();
	}
}

const app = createApp({
	dependencies: [
		{ provide: 'catservice', useClass: CatsService },
		// Add more dependencies as needed
	],
	routes: [{ path: '/cats', controller: CatsController }],
	middlewares: [json()],
});

app.use((error: any, req: any, res: any, next: any) => {
	res.status(400).json(error);
});

app.listen(8080, () => {
	console.log('🚀 Running @galeh/chuka application on port 8080!');
});


interface CatsServiceInterface {
	add(cat: CatsModel): Promise<void>;
	findAll(): Promise<CatsModel[]>;
	findOne(name: string): Promise<CatsModel | null>;
}

interface CatsModel {
	name: string;
	country: string;
	age: number;
	parents: CatsModel[];
}

```


Explore the possibilities and experience a new level of Express.js development with [@galeh/chuka](https://www.npmjs.com/package/@galeh/chuka). 🌟


GitHub Repository | npm Package

Feel the power of Chuka in your Express.js applications! 🔥🚀

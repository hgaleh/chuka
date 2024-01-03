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
// main.ts
import { createApp, json } from '@galeh/chuka';
import { CatsController, CatsService } from './your-modules'; // Customize based on your project structure

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

```
Explore the possibilities and experience a new level of Express.js development with [@galeh/chuka](https://www.npmjs.com/package/@galeh/chuka). 🌟


GitHub Repository | npm Package

Feel the power of Chuka in your Express.js applications! 🔥🚀

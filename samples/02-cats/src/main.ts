import { createApp, json } from '@galeh/chuka';
import { CatsController } from './cats/cats-controller';
import { CatsService } from './cats/cats-service';

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
	console.error('there is an error:', JSON.stringify(error));
    res.status(400).json(error);
})

app.listen(8080, () => {
    console.log('running application!');
});

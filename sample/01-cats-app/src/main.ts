import { createApp } from 'galeh';
import { json } from 'galeh/middlewares';
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

app.listen(8080, () => {
    console.log('running application!');
});

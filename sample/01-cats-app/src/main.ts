import { createApp } from 'galeh';
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
    ]
});

app.listen(8080, () => {
    console.log('running application!');
});

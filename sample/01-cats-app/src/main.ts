import { createApp } from 'galeh';
import { CatsController } from './cats/cats-controller';
import { CatsService } from './cats/cats-service';

const app = createApp([
    {
        path: '/cats',
        controller: CatsController,
        dependencies: [
            {
                provide: 'catservice',
                useClass: CatsService
            }
        ]
    }
]);

app.listen(8080, () => {
    console.log('running application!');
});

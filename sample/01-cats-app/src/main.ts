import { createApp } from 'galeh';
import { CatsController } from './cats/cats-controller';

const app = createApp([
    {
        path: '/cats',
        controller: CatsController
    }
]);

app.listen(8080, () => {
    console.log('running application!');
});

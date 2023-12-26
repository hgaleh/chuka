import { Controller } from 'galeh';
import { injectable } from 'inversify';

@injectable()
export class CatsController extends Controller<unknown> {
    constructor() {
        super();
        this.get('/', (req, res) => {
            res.send('a list of all cats!');
        });
    }
}

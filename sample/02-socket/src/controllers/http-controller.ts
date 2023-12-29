import { Controller } from 'galeh';

export class HttpController extends Controller {
    constructor() {
        super();
        const intercepted = this.middleware();
    
        intercepted.get('/', (req, res) => {
            const sess = req.session;
            if (!req.session?.count) {
                req.session.count = 1;
            } else {
                req.session.count++;
            }
            res.send(`session value is: ${req.session.count}. sessionId: ${req.session.id}`);
        });
    }
}
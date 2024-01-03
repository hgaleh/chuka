import { Controller } from '@galeh/chuka';

export class HttpController extends Controller {
    intercepted = this.middleware();

    getRefreshCount = this.intercepted.get('/', (req, res) => {
        if (!req.session?.count) {
            req.session.count = 1;
        } else {
            req.session.count++;
        }
        res.send(`session value is: ${req.session.count}. sessionId: ${req.session.id}`);
    });
}
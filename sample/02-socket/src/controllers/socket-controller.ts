import { Controller } from 'galeh';

export class SocketController extends Controller {
    constructor() {
        super();

        this.middlewareWS(
            (ws, req, next) => {
                console.log({middlewareSessionId: req.session.id});
                console.log({count: req.session.count});
                next();
            }
        )((ws, req) => {
            ws.on('message', (m) => {
                console.log(`message: ${m}`);
                const session = req.session.reload(() => {
                    console.log(`session.count: ${session.count}`);
                });
            });
        });
    }
}
import { createApp } from 'galeh';
import { HttpController } from './controllers/http-controller';
import { SocketController } from './controllers/socket-controller';
import { createSession } from './middleware/create-session';
import { MemoryStore } from 'express-session';

declare global {
    namespace Express {
        interface Request {
        }
    }
}

declare module 'express-session' {
    interface SessionData {
        count: number;
    }
}
const sessionStore = new MemoryStore();

const middlw = createSession<{ count: number }>({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: sessionStore
});



const app = createApp({
    routes: [
        {
            path: '/http',
            controller: HttpController
        },
        {
            path: '/socket',
            controller: SocketController
        }
    ],
    middlewares: [
        middlw
    ]
});

app.listen(8080, () => {
    console.log('app is running!');
});

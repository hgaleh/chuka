import { AuthController } from './controllers/auth-controller';
import { createApp } from '@galeh/chuka';
import { injectionTokens } from './enums/injection-tokens';
import { json, urlencoded, raw } from '@galeh/chuka';
import { globalErrorHandler } from './middlewares/global-error-handler';
import { AuthService } from './services/auth-service';
import { UserService } from './services/user-service';
import { connection } from './config';

const app = createApp({
    dependencies: [
        {
            provide: injectionTokens.AuthService,
            useClass: AuthService
        },
        {
            provide: injectionTokens.UserService,
            useClass: UserService
        },
        {
            provide: injectionTokens.Connection,
            useValue: connection
        }
    ],    
    routes: [
        {
            path: '/',
            controller: AuthController
        }
    ],
    middlewares: [
        urlencoded({ extended: true }),
        json(),
        raw()
    ]
});

app.use(globalErrorHandler);

app.listen(8080, () => {
    console.log('running application!');
});

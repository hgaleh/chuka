import { injectionTokens } from '../enums/injection-tokens';
import { resultCodes } from '../enums/result-codes';
import { Controller } from 'galeh';
import { inject } from 'galeh/decorators';
import { authHandler } from '../middlewares/auth-handler';
import { AuthServiceInterface } from '../services/interfaces/auth-service-interface';
import { UserServiceInterface } from '../services/interfaces/user-service-interface';

export class AuthController extends Controller {
    constructor(
      @inject(injectionTokens.UserService) userService: UserServiceInterface,
      @inject(injectionTokens.AuthService) authService: AuthServiceInterface
    ) {
        super();
        const middleware = this.middleware();
        const authorised = middleware.middleware(authHandler);

        authorised.get('/check-token', (req, res) => {
          res.setHeader('User-Id', req.user.id);
          res.sendStatus(200);
        });

        authorised.get('/me', async (req, res) => {
          const user = await userService.getUserById(req.user.id);
          res.json({ result: resultCodes.SUCCESS, user });
        });

        middleware.post('/register', async (req, res, next) => {
          const { name, email, password } = req.body;

          try {
            await authService.registerUser(name, email, password);
            res.status(201).json({ result: resultCodes.SUCCESS });
          } catch (x) {
            next(x);
          }

        });

        middleware.post('/login', async (req, res, next) => {
          const { email, password } = req.body;

          try {
            const data = await authService.getTokenFromEmailAndPassword(email, password);
            res.json({ result: resultCodes.SUCCESS, data });
          } catch (x) {
            next(x);
          }

        });
    }
}

import { injectionTokens } from '../enums/injection-tokens';
import { resultCodes } from '../enums/result-codes';
import { Controller } from '@galeh/chuka';
import { inject } from '@galeh/chuka';
import { authHandler } from '../middlewares/auth-handler';
import { AuthServiceInterface } from '../services/interfaces/auth-service-interface';
import { UserServiceInterface } from '../services/interfaces/user-service-interface';

export class AuthController extends Controller {

  intercepted = this.use();
  authorised = this.intercepted.use(authHandler);

  checkToken = this.authorised.get('/check-token', (req, res) => {
    res.setHeader('User-Id', req.user.id);
    res.sendStatus(200);
  });

  me = this.authorised.get('/me', async (req, res) => {
    const user = await this.userService.getUserById(req.user.id);
    res.json({ result: resultCodes.SUCCESS, user });
  });

  register = this.intercepted.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
      await this.authService.registerUser(name, email, password);
      res.status(201).json({ result: resultCodes.SUCCESS });
    } catch (x) {
      next(x);
    }

  });

  login = this.intercepted.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const data = await this.authService.getTokenFromEmailAndPassword(email, password);
      res.json({ result: resultCodes.SUCCESS, data });
    } catch (x) {
      next(x);
    }

  });

  constructor(
    @inject(injectionTokens.UserService) private userService: UserServiceInterface,
    @inject(injectionTokens.AuthService) private authService: AuthServiceInterface
  ) {
    super();
  }
}

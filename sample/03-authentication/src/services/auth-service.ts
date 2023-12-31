import { getJWTToken, verifyPassword } from '../utils/crypto'
import { UserAlreadyExist } from '../exceptions/user-already-exist';
import { WrongLoginInfoException } from '../exceptions/wrong-login-info-exception';
import { inject, injectable } from 'galeh/decorators'
import { UserServiceInterface } from './interfaces/user-service-interface'
import { UserModel } from '../models/user-model'
import { AuthServiceInterface } from './interfaces/auth-service-interface'
import { Token } from '../types/token'
import { injectionTokens } from '../enums/injection-tokens';

@injectable()
export class AuthService implements AuthServiceInterface{
  constructor(@inject(injectionTokens.UserService) private userService: UserServiceInterface ) { }

  async registerUser(name: string, email: string, password: string): Promise<Omit<UserModel, 'password'>> {
    const checkUser = await this.userService.getUserByEmail(email);
    if (checkUser) {
      throw new UserAlreadyExist();
    }
  
    const userObject = this.userService.build({
      name,
      email,
      password
    });
  
    await userObject.validate();
    await userObject.save();
    return {
      id: userObject.id,
      name: userObject.name,
      email: userObject.email
    }
  }

  async getTokenFromEmailAndPassword(email: string, password: string): Promise<Token> {
    const userObject = await this.userService.getUserByEmail(email);

    if (!userObject) {
      throw new WrongLoginInfoException()
    }
  
    const isVerified = verifyPassword(password, userObject.password)
    if (isVerified) {
      return { token: getJWTToken({ id: userObject.id }) }
    } else {
      throw new WrongLoginInfoException()
    }
  }
}

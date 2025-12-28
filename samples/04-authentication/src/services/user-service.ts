import { inject, injectable } from '@galeh/chuka';
import { UserNotFound } from '../exceptions/user-not-found';
import { UserServiceInterface } from './interfaces/user-service-interface';
import { UserModel } from '../models/user-model';
import { getSaltHashPassword } from '../utils/crypto';
import { injectionTokens } from '../enums/injection-tokens';
import { DataTypes, ModelStatic, Sequelize } from 'sequelize';

@injectable()
export class UserService implements UserServiceInterface {
  private user: any;

  constructor(@inject(injectionTokens.Connection) private connection: Sequelize) {
    this.user = this.defineUser();
  }

  async getUserByEmail(email: string): Promise<UserModel | null> {
    const user = await this.user.findOne({ where: { email } });
    return user && {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    };
  }

  async getUserById(id: number): Promise<Omit<UserModel, 'password'>> {
    const user = await this.user.findOne({ where: { id } })
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
    throw new UserNotFound();
  }

  build(userDto: Omit<UserModel, 'id'>): typeof this.user {
    const passObject = getSaltHashPassword(userDto.password)
    return this.user.build({
      name: userDto.name,
      email: userDto.email,
      password: passObject.passwordHash
    });
  }

  private defineUser(): ModelStatic<any> {
    return this.connection.define('user', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          len: [2, 255]
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'users',
      timestamps: false
    });
  }
}


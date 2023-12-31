import { Ex02Error } from './error';

export class PasswordNotFoundException extends Ex02Error {
  constructor (message?: string) {
    super(message);
    this.name = 'PasswordNotFoundException';
    this.httpStatusCode = 401;
  }
}

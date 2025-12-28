import { Ex02Error } from './error'

export class UserNotFound extends Ex02Error {
  constructor (message?: string) {
    super(message);
    this.name = 'UserNotFound';
    this.httpStatusCode = 204;
  }
}

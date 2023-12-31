import { Ex02Error } from './error'

export class UserAlreadyExist extends Ex02Error {
  constructor (message?: string) {
    super(message);
    this.name = 'UserAlreadyExist';
    this.httpStatusCode = 402;
  }
}

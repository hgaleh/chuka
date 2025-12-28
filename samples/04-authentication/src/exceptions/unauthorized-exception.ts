import { Ex02Error } from './error'

export class UnauthorizedException extends Ex02Error {
  constructor (message?: string) {
    super(message);
    this.name = 'UnauthorizedException';
    this.httpStatusCode = 401;
  }
}

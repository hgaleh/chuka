import { Ex02Error } from "./error"

export class WrongLoginInfoException extends Ex02Error {
  constructor (message?: string) {
    super(message);
    this.name = 'WrongLoginInfoException';
  }
}

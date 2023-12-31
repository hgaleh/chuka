import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export const passwordSalt = process.env?.JWT_SALT || 'someSecret';

const sha512 = function (password: string, salt: string) {
  const hash = crypto.createHmac('sha512', salt)
  /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt,
    passwordHash: value
  }
}

export function getSaltHashPassword (password: string) {
  return sha512(password, passwordSalt);
}

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return sha512(password, passwordSalt).passwordHash === hashedPassword;
}

export function getJWTToken (payload: string | object | Buffer): string {
  return jwt.sign(payload, passwordSalt, { expiresIn: '3y' });
}

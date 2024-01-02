import { passwordSalt } from '../utils/crypto'
import { Middleware } from '@galeh/chuka'

import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user-model';

export const authHandler: Middleware<{ user:  UserModel}> = (req, res, next) => {
  const authHeader = req.headers?.authorization;

  jwt.verify(authHeader as string, passwordSalt, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user as UserModel;
    next();
  })
}

import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import db from '../model/db';

const authRoutes = Router();

authRoutes.get('/', (req: Request, res: Response) => {
  res.render('main', { layout: 'index' });
});

authRoutes.post('/register', async (req, res) => {
  try {
    await db.users.create(req.body);
    res.status(httpStatus.CREATED).send();
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
});

export default authRoutes;

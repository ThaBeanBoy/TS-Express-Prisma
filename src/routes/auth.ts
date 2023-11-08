import { Router, Request, Response } from 'express';
import db from '../model/db';
const authRoutes = Router();

authRoutes.get('/', (req: Request, res: Response) => {
  res.render('main', { layout: 'index' });
});

authRoutes.post('/register', async (req, res) => {
  try {
    db.users.create(req.body);
    console.log(req.body);

    res.send(req.body);
  } catch (error) {
    res.redirect('/register');
  }
});

export default authRoutes;

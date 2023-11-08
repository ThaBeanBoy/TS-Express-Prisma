import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authRoutes = Router();

authRoutes.get('/', (req: Request, res: Response) => {
  res.render('main', { layout: 'index' });
});

authRoutes.post('/register', async (req, res) => {
  // req.body.password
  try {
    console.log(req.body);

    res.send(req.body);
    // const user = await prisma.user.create({
    //   data: {
    //     name: req.body.name,
    //     email: req.body.email,
    //     username: req.body.username,
    //     password: await bcrypt.hash(req.body.password, 10),
    //   },
    // });

    res.redirect('/');
  } catch (error) {
    res.redirect('/register');
  }
});

export default authRoutes;

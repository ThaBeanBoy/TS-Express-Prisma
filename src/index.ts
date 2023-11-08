import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as local from 'passport-local';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

import * as handlebars from 'express-handlebars';
import path from 'path';

import authRoutes from './routes/auth';

enum appConfig {
  defaultPort = 3000,
}

const app = express();
const port = process.env.PORT || appConfig.defaultPort;

app.engine(
  'handlebars',
  handlebars.engine({
    defaultLayout: path.join(__dirname, 'views/layouts'), // Specify the correct path to your layouts directory
  })
);

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
const prisma = new PrismaClient();

// Passport.use(
//   new local.Strategy(async (username, password, done) => {
//     const user = await prisma.user.findFirst({ where: { username } });

//     if (!user) {
//       return done(null, false, { message: 'Username/Email does not exist' });
//     }

//     const incorrectPassword = await !bcrypt.compare(password, user.password);
//     if (incorrectPassword) {
//       return done(null, false, { message: 'Incorrect password' });
//     }

//     return done(null, user);
//   })
// );

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.use('/account', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

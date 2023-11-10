import express, { Request, Response } from 'express';
import helmet from 'helmet';
import * as handlebars from 'express-handlebars';

import path from 'path';

import authRoutes from './routes/auth';

enum appConfig {
  defaultPort = 3000,
}

const app = express();
const port = process.env.PORT || appConfig.defaultPort;

app.use(helmet());

app.engine(
  'handlebars',
  handlebars.engine({
    defaultLayout: path.join(__dirname, 'views/layouts'), // Specify the correct path to your layouts directory
  })
);

app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/account', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

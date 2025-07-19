import express, { Express, Response, Request } from 'express';
import cors from 'cors';
import env from 'dotenv';
import { userRoute } from './routes/user.route';
import { errorHandler } from './middlewares/errorHanddler';
import 'tsconfig-paths/register';
import { hotelRouter } from './routes/hotel.route';
import { experienceRouter } from './routes/experience.route';
import { roomRouter } from './routes/room.route';
import { ratingRoute } from './routes/rating.route';
import { orderRoute } from './routes/order.route';
env.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/example', (req: Request, res: Response) => {
  res.send('Hello World');
});
app.use('/user', userRoute);
app.use('/experience', experienceRouter);
app.use('/hotels', hotelRouter);
app.use('/rooms', roomRouter);
app.use('/rating', ratingRoute);
app.use('/order', orderRoute)
app.use(errorHandler);

app.listen(PORT || 8000, () => {
  console.log(`server is up and running ${PORT} `);
});

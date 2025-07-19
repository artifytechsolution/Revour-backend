import express from 'express';
import RatingController from 'src/controller/rating.controller';
import verifyToken from 'src/middlewares/Verifyauth';

const rating = new RatingController();

export const route = express.Router();

route.post('/', verifyToken, (req, resp, next) =>
  rating.create(req, resp, next),
);
route.get('/:id', (req, resp, next) => rating.findById(req, resp, next));
route.get('/', (req, resp, next) => rating.find(req, resp, next));
route.delete('/delete', (req, resp, next) => rating.delete(req, resp, next));
route.get('/hotel/:id', (req, resp, next) =>
  rating.findByHotel(req, resp, next),
);
// route.patch('/update', (req, resp, next) => Room.update(req, resp, next));
export { route as ratingRoute };

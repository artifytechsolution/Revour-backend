import express from 'express';
import ExperienceController from 'src/controller/experence.controller';

// import verifyToken from '../middlewares/Verifyauth';

const Experience = new ExperienceController();

export const route = express.Router();

route.post('/', (req, resp, next) => Experience.create(req, resp, next));
route.get('/:id', (req, resp, next) => Experience.findById(req, resp, next));
route.get('/', (req, resp, next) => Experience.find(req, resp, next));
route.delete('/delete', (req, resp, next) =>
  Experience.delete(req, resp, next),
);

// route.patch('/update', (req, resp, next) => Experience.update(req, resp, next));
export { route as experienceRouter };

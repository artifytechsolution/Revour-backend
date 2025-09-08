import express from 'express';
import upload from 'src/config/multer.config';

// import verifyToken from '../middlewares/Verifyauth';
import HotelController from 'src/controller/hotel.controller';

const Hotel = new HotelController();

export const route = express.Router();

route.post('/', (req, resp, next) => Hotel.create(req, resp, next));
route.get('/:id', (req, resp, next) => Hotel.findById(req, resp, next));
route.get('/', (req, resp, next) => Hotel.find(req, resp, next));
route.delete('/delete', (req, resp, next) => Hotel.delete(req, resp, next));
route.post(
  '/upload',
  upload.array('images', 5),
  (req: any, resp: any, next: any) => Hotel.uploadImage(req, resp, next),
);
route.get('/find/hours', (req, resp, next) =>
  Hotel.findByHours(req, resp, next),
);
route.post('/hotelunavilable', (req, resp, next) =>
  Hotel.hotelunavilable(req, resp, next),
);
route.get('/hotelunavilableById/:id', (req, resp, next) =>
  Hotel.hotelunavilableById(req, resp, next),
);
route.get('/find/hotelunavilableList', (req, resp, next) =>
  Hotel.hotelunavilableList(req, resp, next),
);
route.put('/updaterooms', (req, resp, next) =>
  Hotel.updatehours(req, resp, next),
);
route.put('/updaterooms2', (req, resp, next) =>
  Hotel.updaterooms(req, resp, next),
);
route.post('/addAmenities', (req, resp, next) =>
  Hotel.addAmenities(req, resp, next),
);
route.post('/addpolicy', (req, resp, next) => Hotel.addPolicy(req, resp, next));
// route.patch('/update', (req, resp, next) => Hotel.update(req, resp, next));

export { route as hotelRouter };

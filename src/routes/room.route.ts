import express from 'express';

import RoomController from 'src/controller/room.controller';

const Room = new RoomController();

export const route = express.Router();

route.post('/', (req, resp, next) => Room.create(req, resp, next));
route.get('/:id', (req, resp, next) => Room.findById(req, resp, next));
route.get('/', (req, resp, next) => Room.find(req, resp, next));
route.delete('/delete', (req, resp, next) => Room.delete(req, resp, next));
route.get('/hotel/:id', (req, resp, next) => Room.findByHotel(req, resp, next));
route.post('/addHours',(req, resp, next) => Room.createHours(req, resp, next))
route.delete('/deleteHours',(req, resp, next) => Room.deleteHours(req, resp, next))
// route.patch('/update', (req, resp, next) => Room.update(req, resp, next));
export { route as roomRouter };

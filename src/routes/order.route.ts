import express from 'express';
import OrderController from 'src/controller/order.controller';

const Order = new OrderController();

export const route = express.Router();

route.post('/', (req, resp, next) => Order.create(req, resp, next));
route.post('/verify',(req, resp, next) => Order.verify(req, resp, next))

export { route as orderRoute };

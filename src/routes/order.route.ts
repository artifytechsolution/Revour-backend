import express from 'express';
import OrderController from 'src/controller/order.controller';

const Order = new OrderController();

export const route = express.Router();

route.post('/', (req, resp, next) => Order.create(req, resp, next));
route.post('/verify', (req, resp, next) => Order.verify(req, resp, next));
route.get('/orderlist', (req, resp, next) => Order.orderList(req, resp, next));
route.get('/orderfindById/:id', (req, resp, next) =>
  Order.orderListByid(req, resp, next),
);
route.get('/orderfindByuser/:id', (req, resp, next) =>
  Order.orderListByuser(req, resp, next),
);
route.get('/cancelRequest/:id', (req, resp, next) =>
  Order.orderCancel(req, resp, next),
);

export { route as orderRoute };

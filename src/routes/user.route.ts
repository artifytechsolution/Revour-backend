import express from 'express';
import userController from '../controller/user.controller';
// import verifyToken from '../middlewares/Verifyauth';

const usercontroller = new userController();

export const route = express.Router();

route.post('/register', (req, resp, next) =>
  usercontroller.Create(req, resp, next),
);
route.post('/login', (req, resp, next) =>
  usercontroller.Login(req, resp, next),
);
route.get('/', (req, resp, next) => usercontroller.allusers(req, resp, next));
route.patch('/verify', (req, resp, next) =>
  usercontroller.verifyUser(req, resp, next),
);

route.patch('/forgetpassword', (req, resp, next) =>
  usercontroller.Forgetpassword(req, resp, next),
);

route.post('/sendmail', (req, resp, next) =>
  usercontroller.sendMail(req, resp, next),
);
export { route as userRoute };

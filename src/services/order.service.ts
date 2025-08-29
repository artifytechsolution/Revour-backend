// import prisma from 'src/config/db.config';
// import { statusCode } from 'src/config/statuscode';
// import { IOrderRepository } from 'src/domain/interfaces/orderRepository';
// import { IUserRepository } from 'src/domain/interfaces/userRepository';
// import { CustomError } from 'src/utils/customeerror';
// import crypto from 'crypto';
// import razorpay from 'src/config/razorpay.config';
// import { IRoomRepository } from 'src/domain/interfaces/roomRepository';
// import { IexperienceRepository } from 'src/domain/interfaces/experienceRepository';
// import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';

// export default class OrderService {
//   constructor(
//     private orderRepo: IOrderRepository,
//     private userRepo: IUserRepository,
//     private roomRepo: IRoomRepository,
//     private experience: IexperienceRepository,
//     private hotel: IHotelRepository,
//   ) {}

//   async create(data: any) {
//     try {
//       const {
//         amount,
//         currency = 'INR',
//         booking_type,
//         order_type,
//         user_id,
//         tax_amount,
//         days,
//         duration_hours,
//         discount_amount,
//         hotel_id,
//         check_in_datetime,
//         check_out_datetime,
//         item_id,
//       } = data;
//       const user: any = await this.userRepo.findById(user_id);
//       console.log('user is commig');
//       console.log(user);

//       if (!user) {
//         throw new CustomError(
//           'user is not exist in order',
//           statusCode.notFound,
//         );
//       }
//       console.log(
//         !amount || !order_type || !user_id || !item_id || !order_type,
//       );
//       if (!amount || !order_type || !user_id || !item_id || !order_type) {
//         throw new CustomError(
//           'Amount, order_type, user_id are required',
//           statusCode.badRequest,
//         );
//       }

//       let total;
//       if (order_type == 'HOTEL') {
//         const findRoom = await this.roomRepo.findById(item_id);
//         console.log('find room is herererere');
//         console.log(findRoom);
//         if (!findRoom) {
//           throw new CustomError(
//             'room is not found please enter a valid id',
//             statusCode.notFound,
//           );
//         }
//         total = findRoom.base_price * days;
//       } else if (order_type == 'EXPERIENCE') {
//         const findService = await this.experience.findById(data.item_id);
//         if (!findService) {
//           throw new CustomError(
//             'EXPERIENCE is not found please enter a valid id',
//             statusCode.notFound,
//           );
//         }
//         total = findService.price;
//       } else if (order_type == 'HOURS') {
//         const findService = await this.roomRepo.hoursFind(data.item_id);
//         if (!findService) {
//           throw new CustomError(
//             'HOURS is not found please enter a valid id',
//             statusCode.notFound,
//           );
//         }
//         total = findService.rate_per_hour;
//       } else {
//         throw new CustomError(
//           'please enter a valid order Type',
//           statusCode.notFound,
//         );
//       }
//       const findHotel = await this.hotel.findById(hotel_id);
//       if (!findHotel) {
//         throw new CustomError(
//           'hotel is not found in order',
//           statusCode.notFound,
//         );
//       }
//       console.log('hotel details is commminnnnnggg in order');
//       console.log(findHotel.hotel_id);

//       const reservationData = {
//         hotel_id: findHotel.hotel_id as number,
//         user_id: user.userId,
//         check_in_datetime: new Date(check_in_datetime) ?? new Date(),
//         check_out_datetime: new Date(check_out_datetime) ?? new Date(),
//         total_amount: total,
//         booking_type: booking_type ?? 'full day',
//         duration_hours: duration_hours ? duration_hours : days * 24,
//       };
//       console.log(reservationData);
//       const createReservation = await this.createreservations(reservationData);
//       if (!createReservation) {
//         throw new CustomError(
//           'try again not create Reservations',
//           statusCode.notFound,
//         );
//       }

//       console.log('createReservation sucessfully wordked');
//       console.log(createReservation);

//       const reservation: any = await this.orderRepo.reservationFindById(
//         createReservation.reservation_id,
//       );
//       console.log('reservation is founnddd herererere');
//       console.log(reservation);
//       if (!reservation) {
//         throw new CustomError(
//           'Reservation is not avilable first create It',
//           statusCode.notFound,
//         );
//       }
//       if (
//         reservation.status === 'cancelled' ||
//         reservation.status === 'checked_out'
//       ) {
//         throw new CustomError('Reservation is not active', statusCode.notFound);
//       }
//       const totalAmount = Number(reservation.total_amount);
//       console.log('---start----');
//       console.log(reservation.total_amount);
//       console.log(
//         Number(amount) + Number(tax_amount || 0) - Number(discount_amount || 0),
//       );
//       console.log('---end----');
//       if (
//         Number(amount) +
//           Number(tax_amount || 0) -
//           Number(discount_amount || 0) !==
//         totalAmount
//       ) {
//         // throw new CustomError(
//         //   'Order amount does not match reservation total',
//         //   statusCode.notFound,
//         // );
//         console.error('Order amount does not match reservation total');
//       }
//       const Options = {
//         amount: Math.round(amount * 100),
//         currency,
//         receipt: `receipt_${Date.now()}`,
//       };
//       const razorpayOrder = await this.orderRepo.razorPayOrderCreate(Options);
//       console.log(razorpayOrder);
//       if (!razorpayOrder) {
//         throw new CustomError('Razor Pay Order fail', statusCode.notFound);
//       }
//       console.log('order details is comming---------');
//       console.log({
//         id: razorpayOrder.id,
//         razorpay_order_id: razorpayOrder.id,
//         order_type,
//         reservation_id: createReservation.reservation_id,
//         amount: reservation.total_amount,
//         tax_amount,
//         discount_amount: discount_amount ?? 0,
//         user_id: user.user_id,
//         currency,
//         status: 'PENDING',
//       });
//       const createOrder = await this.orderRepo.create({
//         id: razorpayOrder.id,
//         razorpay_order_id: razorpayOrder.id,
//         order_type,
//         reservation_id: createReservation.reservation_id,
//         amount: reservation.total_amount,
//         tax_amount,
//         discount_amount,
//         user_id: user.userId,
//         currency,
//         status: 'PENDING',
//       });
//       const createBill = await prisma.bills.create({
//         data: {
//           reservation_id: createReservation.reservation_id,
//           total_amount: reservation.total_amount,
//           tax_amount,
//           discount_amount: discount_amount ?? 0,
//           base_amount: amount,
//           user_id: user.userId,
//           invoice_number: `INV-${Date.now()}`,
//           payment_status: 'PENDING',
//           payment_method: 'razorpay',
//         },
//       });

//       return {
//         order_id: createOrder.razorpay_order_id,
//         bill_id: createBill.bill_id,
//         amount: reservation.total_amount,
//         currency: createOrder.currency,
//         //this is not safe
//         key: process.env.RAZORPAY_KEY_ID,
//       } as any;
//     } catch (error: unknown) {
//       if (error instanceof CustomError) {
//         throw error; // Re-throw known custom errors
//       }
//       if (error instanceof Error) {
//         throw new CustomError(error.message, 500);
//       }
//       throw new CustomError('An unknown error occurred', 500);
//     }
//   }
//   async verify(data: any) {
//     try {
//       const {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         bill_id,
//       } = data;
//       console.log('alll data is comming for varification processsss');
//       console.log(data);
//       const generatedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//         .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//         .digest('hex');

//       if (generatedSignature !== razorpay_signature) {
//         throw new CustomError('Invalid signature', statusCode.notFound);
//       }
//       const order = await this.orderRepo.orderFindById(razorpay_order_id);
//       if (!order) {
//         throw new CustomError('Order not found', statusCode.notFound);
//       }

//       const bill = await prisma.bills.findUnique({ where: { bill_id } });
//       if (!bill) {
//         throw new CustomError('Bill not found', statusCode.notFound);
//       }
//       const payment: any = await razorpay.payments.fetch(razorpay_payment_id);
//       //update section is satically set
//       await prisma.$transaction([
//         prisma.orders.update({
//           where: { razorpay_order_id },
//           data: {
//             razorpay_payment_id,
//             payment_method: payment.method.toUpperCase() || 'UPI',
//             status: 'SUCCESS',
//             attempts: { increment: 1 },
//             updatedAt: new Date(),
//           },
//         }),
//         prisma.bills.update({
//           where: { bill_id },
//           data: {
//             payment_status: 'PAID',
//             payment_method: 'razorpay',
//             updatedAt: new Date(),
//           },
//         }),
//         prisma.reservations.update({
//           where: { reservation_id: order.reservation_id ?? 0 },
//           data: { status: 'confirmed' },
//         }),
//       ]);
//       return 'Payment verified successfully';
//     } catch (error: unknown) {
//       if (error instanceof CustomError) {
//         throw error; // Re-throw known custom errors
//       }
//       if (error instanceof Error) {
//         throw new CustomError(error.message, 500);
//       }
//       throw new CustomError('An unknown error occurred', 500);
//     }
//   }
//   async createreservations(data: any) {
//     try {
//       const createReservation = await this.orderRepo.createReservations(data);
//       if (!createReservation) {
//         throw new CustomError('reservation is not ', statusCode.notFound);
//       }
//       return createReservation;
//     } catch (error: unknown) {
//       if (error instanceof CustomError) {
//         throw error; // Re-throw known custom errors
//       }
//       if (error instanceof Error) {
//         throw new CustomError(error.message, 500);
//       }
//       throw new CustomError('An unknown error occurred', 500);
//     }
//   }
//   async allOrders() {
//     return this.orderRepo.orderlist();
//   }
//   async orderFindById(id: number) {
//     return this.orderRepo.orderListByid(id);
//   }
//   async orderFindByuser(id: string) {
//     const user = await this.userRepo.findById(id);
//     console.log('user data is comming form that');
//     console.log(user);
//     if (!user) {
//       throw new CustomError('user is not avilable ', statusCode.notFound);
//     }
//     return await this.orderRepo.orderlistByuser(user?.userId ?? 0);
//   }
// }

import prisma from 'src/config/db.config';
import { statusCode } from 'src/config/statuscode';
import { IOrderRepository } from 'src/domain/interfaces/orderRepository';
import { IUserRepository } from 'src/domain/interfaces/userRepository';
import { CustomError } from 'src/utils/customeerror';
import crypto from 'crypto';
import razorpay from 'src/config/razorpay.config';
import { IRoomRepository } from 'src/domain/interfaces/roomRepository';
import { IexperienceRepository } from 'src/domain/interfaces/experienceRepository';
import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';

export default class OrderService {
  constructor(
    private orderRepo: IOrderRepository,
    private userRepo: IUserRepository,
    private roomRepo: IRoomRepository,
    private experience: IexperienceRepository,
    private hotel: IHotelRepository,
  ) {}

  async create(data: any) {
    try {
      const {
        amount,
        currency = 'INR',
        booking_type,
        order_type,
        user_id,
        tax_amount,
        payment_method,
        days,
        duration_hours,
        discount_amount,
        hotel_id = null,
        experience_id,
        check_in_datetime,
        check_out_datetime,
        item_id,
      } = data;
      const user: any = await this.userRepo.findById(user_id);
      console.log('user is commig');
      console.log(data);
      console.log(payment_method);

      if (!user) {
        throw new CustomError(
          'user is not exist in order',
          statusCode.notFound,
        );
      }
      console.log(
        !amount || !order_type || !user_id || !item_id || !order_type,
      );
      if (!amount || !order_type || !user_id || !item_id || !order_type) {
        throw new CustomError(
          'Amount, order_type, user_id are required',
          statusCode.badRequest,
        );
      }

      let total;
      if (order_type == 'HOTEL') {
        const findRoom = await this.roomRepo.findById(item_id);
        console.log('find room is herererere');
        console.log(findRoom);
        if (!findRoom) {
          throw new CustomError(
            'room is not found please enter a valid id',
            statusCode.notFound,
          );
        }
        total = findRoom.base_price * days;
      } else if (order_type == 'EXPERIENCE') {
        const findService = await this.experience.findById(data.item_id);
        if (!findService) {
          throw new CustomError(
            'EXPERIENCE is not found please enter a valid id',
            statusCode.notFound,
          );
        }
        total = findService.price;
      } else if (order_type == 'HOURS') {
        const findService = await this.roomRepo.hoursFind(data.item_id);
        if (!findService) {
          throw new CustomError(
            'HOURS is not found please enter a valid id',
            statusCode.notFound,
          );
        }
        total = findService.rate_per_hour;
      } else {
        throw new CustomError(
          'please enter a valid order Type',
          statusCode.notFound,
        );
      }
      console.log('HOTEL ID IS HERE+++++++++', hotel_id);
      console.log('EXPERIENCE ID IS HERE++++', experience_id);
      let findHotel;
      let findExperience;
      if (hotel_id !== null && hotel_id !== undefined) {
        console.log('hotel is callleddd------');
        findHotel = await this.hotel.findById(hotel_id);

        if (!findHotel) {
          throw new CustomError(
            'hotel is not found in order',
            statusCode.notFound,
          );
        }

        console.log('Hotel details are coming in order');
        console.log(findHotel.hotel_id);
      } else if (experience_id !== null && experience_id !== undefined) {
        console.log('expirence is calleddd---------');
        findExperience = await this.experience.findById(experience_id);

        if (!findExperience) {
          throw new CustomError(
            'experience is not found in order',
            statusCode.notFound,
          );
        }
      } else {
        throw new CustomError(
          'Either hotel_id or experience_id must be provided',
          statusCode.badRequest,
        );
      }

      const reservationData = {
        hotel_id: (findHotel?.hotel_id as number) ?? null,
        experience_id: (findExperience?.experience_id as number) ?? null,
        user_id: user.userId,
        check_in_datetime: new Date(check_in_datetime) ?? new Date(),
        check_out_datetime: new Date(check_out_datetime) ?? new Date(),
        total_amount: total,
        booking_type: booking_type ?? 'full day',
        duration_hours: duration_hours ? duration_hours : days * 24,
      };
      console.log(reservationData);
      const createReservation = await this.createreservations(reservationData);
      if (!createReservation) {
        throw new CustomError(
          'try again not create Reservations',
          statusCode.notFound,
        );
      }

      console.log('createReservation sucessfully wordked');
      console.log(createReservation);

      const reservation: any = await this.orderRepo.reservationFindById(
        createReservation.reservation_id,
      );
      console.log('reservation is founnddd herererere');
      console.log(reservation);
      if (!reservation) {
        throw new CustomError(
          'Reservation is not avilable first create It',
          statusCode.notFound,
        );
      }
      if (
        reservation.status === 'cancelled' ||
        reservation.status === 'checked_out'
      ) {
        throw new CustomError('Reservation is not active', statusCode.notFound);
      }
      const totalAmount = Number(reservation.total_amount);
      console.log('---start----');
      console.log(reservation.total_amount);
      console.log(
        Number(amount) + Number(tax_amount || 0) - Number(discount_amount || 0),
      );
      console.log('---end----');
      if (
        Number(amount) +
          Number(tax_amount || 0) -
          Number(discount_amount || 0) !==
        totalAmount
      ) {
        // throw new CustomError(
        //   'Order amount does not match reservation total',
        //   statusCode.notFound,
        // );
        console.error('Order amount does not match reservation total');
      }
      const Options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_${Date.now()}`,
      };
      const razorpayOrder = await this.orderRepo.razorPayOrderCreate(Options);
      console.log(razorpayOrder);
      if (!razorpayOrder) {
        throw new CustomError('Razor Pay Order fail', statusCode.notFound);
      }
      console.log('order details is comming---------');
      console.log({
        id: razorpayOrder.id,
        razorpay_order_id: razorpayOrder.id,
        order_type,
        reservation_id: createReservation.reservation_id,
        amount: reservation.total_amount,
        tax_amount,
        discount_amount: discount_amount ?? 0,
        user_id: user.user_id,
        currency,
        status: 'PENDING',
      });
      const createOrder = await this.orderRepo.create({
        id: razorpayOrder.id,
        razorpay_order_id: razorpayOrder.id,
        order_type,
        reservation_id: createReservation.reservation_id,
        amount: reservation.total_amount,
        payment_method: payment_method ?? null,
        tax_amount,
        discount_amount,
        user_id: user.userId,
        currency,
        status: 'PENDING',
      });
      console.log('create order is herere-------------');
      console.log(createOrder);
      const createBill = await prisma.bills.create({
        data: {
          reservation_id: createReservation.reservation_id,
          total_amount: reservation.total_amount,
          tax_amount,
          discount_amount: discount_amount ?? 0,
          base_amount: amount,
          user_id: user.userId,
          invoice_number: `INV-${Date.now()}`,
          payment_status: 'PENDING',
          payment_method: 'razorpay',
        },
      });

      return {
        order_id: createOrder.razorpay_order_id,
        bill_id: createBill.bill_id,
        amount: reservation.total_amount,
        currency: createOrder.currency,
        //this is not safe
        key: process.env.RAZORPAY_KEY_ID,
      } as any;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  async verify(data: any) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bill_id,
      } = data;
      console.log('alll data is comming for varification processsss');
      console.log(data);
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        throw new CustomError('Invalid signature', statusCode.notFound);
      }
      const order = await this.orderRepo.orderFindById(razorpay_order_id);
      if (!order) {
        throw new CustomError('Order not found', statusCode.notFound);
      }

      const bill = await prisma.bills.findUnique({ where: { bill_id } });
      if (!bill) {
        throw new CustomError('Bill not found', statusCode.notFound);
      }
      const payment: any = await razorpay.payments.fetch(razorpay_payment_id);
      //update section is satically set
      await prisma.$transaction([
        prisma.orders.update({
          where: { razorpay_order_id },
          data: {
            razorpay_payment_id,
            payment_method: payment.method.toUpperCase() || 'UPI',
            status: 'SUCCESS',
            attempts: { increment: 1 },
            updatedAt: new Date(),
          },
        }),
        prisma.bills.update({
          where: { bill_id },
          data: {
            payment_status: 'PAID',
            payment_method: 'razorpay',
            updatedAt: new Date(),
          },
        }),
        prisma.reservations.update({
          where: { reservation_id: order.reservation_id ?? 0 },
          data: { status: 'confirmed' },
        }),
      ]);
      return 'Payment verified successfully';
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  async createreservations(data: any) {
    try {
      const createReservation = await this.orderRepo.createReservations(data);
      if (!createReservation) {
        throw new CustomError('reservation is not ', statusCode.notFound);
      }
      return createReservation;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  async allOrders() {
    return this.orderRepo.orderlist();
  }
  async orderFindById(id: number) {
    return this.orderRepo.orderListByid(id);
  }
  async orderFindByuser(id: string) {
    const user = await this.userRepo.findById(id);
    console.log('user data is comming form that');
    console.log(user);
    if (!user) {
      throw new CustomError('user is not avilable ', statusCode.notFound);
    }
    return await this.orderRepo.orderlistByuser(user?.userId ?? 0);
  }
}

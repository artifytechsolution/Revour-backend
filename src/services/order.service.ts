import prisma from 'src/config/db.config';
import { statusCode } from 'src/config/statuscode';
import { IOrderRepository } from 'src/domain/interfaces/orderRepository';
import { IUserRepository } from 'src/domain/interfaces/userRepository';
import { CustomError } from 'src/utils/customeerror';
import crypto from 'crypto';
import razorpay from 'src/config/razorpay.config';

export default class OrderService {
  constructor(private orderRepo: IOrderRepository, private userRepo:IUserRepository) {}
 
  async create(data: any) {
    try {
      const {
        amount,
        currency = 'INR',
        order_type,
        user_id,
        reservation_id,
        tax_amount,
        discount_amount,
      } = data;
      const user:any = await this.userRepo.findById(user_id)
      console.log("user is commig")
      console.log(user)

      if(!user)
      {
        throw new CustomError(
          'user is not exist in order',
          statusCode.notFound,
        ); 
      }
      if (!amount || !order_type || !user_id || !reservation_id) {
        throw new CustomError(
          'Amount, order_type, user_id, and reservation_id are required',
          statusCode.badRequest,
        );
      }

      const reservation: any =
        await this.orderRepo.reservationFindById(reservation_id);
        console.log("reservation is founnddd herererere")
        console.log(reservation)
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
        console.log("---start----")
    console.log(reservation.total_amount)
    console.log(Number(amount) + Number(tax_amount || 0) - Number(discount_amount || 0))
    console.log("---end----")
      if (
        Number(amount) +
          Number(tax_amount || 0) -
          Number(discount_amount || 0) !==
        totalAmount
      ) {
        throw new CustomError(
          'Order amount does not match reservation total',
          statusCode.notFound,
        );
      }
      const Options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_${Date.now()}`,
      };
      const razorpayOrder = await this.orderRepo.razorPayOrderCreate(Options);
      if (!razorpayOrder) {
        throw new CustomError('Razor Pay Order fail', statusCode.notFound);
      }
      console.log("order details is comming---------")
      console.log({
        id: razorpayOrder.id,
        razorpay_order_id: razorpayOrder.id,
        order_type,
        reservation_id,
        amount,
        tax_amount,
        discount_amount:discount_amount ?? 0,
        user_id:user.user_id,
        currency,
        status: 'PENDING',
      })
      const createOrder = await this.orderRepo.create({
        id: razorpayOrder.id,
        razorpay_order_id: razorpayOrder.id,
        order_type,
        reservation_id,
        amount,
        tax_amount,
        discount_amount,
        user_id:user.userId,
        currency,
        status: 'PENDING',
      });
      const createBill = await prisma.bills.create({
        data: {
          reservation_id,
          total_amount: amount,
          tax_amount,
          discount_amount: discount_amount ?? 0,
          base_amount: amount,
          user_id:user.userId,
          invoice_number: `INV-${Date.now()}`,
          payment_status: 'PENDING',
          payment_method: 'razorpay',
        },
      });

      return {
        order_id: createOrder.razorpay_order_id,
        bill_id: createBill.bill_id,
        amount: createOrder.amount,
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
  async verify(data:any){
    try{
        
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bill_id } = data;
      console.log("alll data is comming for varification processsss")
      console.log(data)
        const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      throw new CustomError("Invalid signature",statusCode.notFound)
    }
     const order = await this.orderRepo.orderFindById(razorpay_order_id);
    if (!order) {
      throw new CustomError("Order not found",statusCode.notFound)
    }

    const bill = await prisma.bills.findUnique({ where: { bill_id } });
    if (!bill) {
      throw new CustomError("Bill not found",statusCode.notFound)
    }
    const payment:any = await razorpay.payments.fetch(razorpay_payment_id);
    //update section is satically set
    await prisma.$transaction([
      prisma.orders.update({
        where: { razorpay_order_id },
        data: {
          razorpay_payment_id,
          payment_method: payment.method.toUpperCase() || "UPI",
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
    return "Payment verified successfully"
    }
    catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
}

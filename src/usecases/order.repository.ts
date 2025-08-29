import prisma from 'src/config/db.config';
import razorpay from 'src/config/razorpay.config';
import { IOrderRepository } from 'src/domain/interfaces/orderRepository';

export class OrderRepository implements IOrderRepository {
  async orderListByid(id: number): Promise<any> {
    return await prisma.reservations.findMany({
      where: {
        hotel_id: id,
      },
      select: {
        hotel_id: true,
        orders: {
          include: {
            reservation: {
              include: {
                hotel: true,
              },
            },
            user: true,
          },
        },
      },
    });
  }
  async createReservations(order: any): Promise<any> {
    return await prisma.reservations.create({
      data: order,
    });
  }
  async orderFindById(id: string): Promise<any> {
    return await prisma.orders.findUnique({
      where: {
        razorpay_order_id: id,
      },
    });
  }
  async reservationFindById(id: number): Promise<any> {
    return await prisma.reservations.findUnique({
      where: { reservation_id: id },
      include: { bills: true },
    });
  }
  async reateReservations(Reservation: any): Promise<any> {
    return await prisma.reservations.create({
      data: Reservation,
    });
  }
  async create(order: any): Promise<any> {
    return await prisma.orders.create({
      data: order,
    });
  }
  verify(order: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async razorPayOrderCreate(order: any): Promise<any> {
    return await razorpay.orders.create(order);
  }
  async orderlist(): Promise<any> {
    return await prisma.orders.findMany({
      include: {
        reservation: {
          include: {
            hotel: true,
          },
        },
        user: true,
      },
    });
  }
  async orderlistByuser(user_id: number): Promise<any> {
    return await prisma.orders.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        reservation: {
          include: {
            hotel: true,
          },
        },
        user: true,
      },
    });
  }
}

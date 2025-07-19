import { UserRepository } from './usecases/user.repository';
import UserService from './services/user.service';
import { HotelRepository } from './usecases/hotel.repository';
import HotelServices from './services/hotel.service';
import { ExperienceRepository } from './usecases/experence.repository';
import ExperienceServices from './services/experience.service';
import { RoomRepository } from './usecases/room.repository';
import RoomService from './services/room.service';
import { RatingRepository } from './usecases/rating.repository';
import RatingService from './services/rating.service';
import { OrderRepository } from './usecases/order.repository';
import OrderService from './services/order.service';

class DIcontainer {
  private static _userRepo = new UserRepository();
  private static _hotelRepo = new HotelRepository();
  private static _experienceRepo = new ExperienceRepository();
  private static _roomsRepo = new RoomRepository();
  private static _ratingRepo = new RatingRepository();
  private static _orderRepo = new OrderRepository();
  static getUerRepository() {
    return this._userRepo;
  }
  static getGetAllUsersUseCase() {
    return new UserService(this.getUerRepository());
  }
  static getHotelRepository() {
    return this._hotelRepo;
  }
  static getGetAllhotelUseCase() {
    return new HotelServices(
      this.getHotelRepository(),
      this.getExperienceRepository(),
    );
  }
  static getExperienceRepository() {
    return this._experienceRepo;
  }
  static getGetAllExperienceUseCase() {
    return new ExperienceServices(this.getExperienceRepository());
  }
  static getRoomRepository() {
    return this._roomsRepo;
  }
  static getGetAllRoomUseCase() {
    return new RoomService(this.getRoomRepository(), this.getHotelRepository());
  }
  static getRatingRepository() {
    return this._ratingRepo;
  }
  static getGetAllRatingUseCase() {
    return new RatingService(
      this.getRatingRepository(),
      this.getHotelRepository(),
    );
  }
  static getOrderRepository(){
    return this._orderRepo;
  }
  static getGetOrderUseCase(){
    return new OrderService(this.getOrderRepository(),this.getUerRepository())
  }
}
export default DIcontainer;

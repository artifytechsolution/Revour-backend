-- CreateTable
CREATE TABLE "hotels" (
    "hotel_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "star_rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("hotel_id")
);

-- CreateTable
CREATE TABLE "hotel_descriptions" (
    "description_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "hotel_descriptions_pkey" PRIMARY KEY ("description_id")
);

-- CreateTable
CREATE TABLE "hotel_images" (
    "image_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "hotel_ratings" (
    "rating_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "hotel_ratings_pkey" PRIMARY KEY ("rating_id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "room_type_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "type_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "max_occupancy" INTEGER NOT NULL,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("room_type_id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "reservation_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "check_in_datetime" TIMESTAMP(3),
    "check_out_datetime" TIMESTAMP(3),
    "total_amount" DECIMAL(10,2) NOT NULL,
    "booking_type" TEXT NOT NULL DEFAULT 'hourly',
    "duration_hours" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "room_hourly_rates" (
    "hourly_rate_id" SERIAL NOT NULL,
    "room_type_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "duration_hours" INTEGER NOT NULL,
    "rate_per_hour" DECIMAL(10,2) NOT NULL,
    "valid_from" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP,

    CONSTRAINT "room_hourly_rates_pkey" PRIMARY KEY ("hourly_rate_id")
);

-- CreateTable
CREATE TABLE "bills" (
    "bill_id" SERIAL NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "issue_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "payment_method" TEXT,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("bill_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_hourly_rates_room_type_id_hotel_id_duration_hours_key" ON "room_hourly_rates"("room_type_id", "hotel_id", "duration_hours");

-- AddForeignKey
ALTER TABLE "hotel_descriptions" ADD CONSTRAINT "hotel_descriptions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_ratings" ADD CONSTRAINT "hotel_ratings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_ratings" ADD CONSTRAINT "hotel_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_hourly_rates" ADD CONSTRAINT "room_hourly_rates_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("room_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_hourly_rates" ADD CONSTRAINT "room_hourly_rates_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

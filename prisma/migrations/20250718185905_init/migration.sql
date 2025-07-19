/*
  Warnings:

  - You are about to drop the column `room_type_id` on the `room_hourly_rates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hotel_id,duration_hours]` on the table `room_hourly_rates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "room_hourly_rates_room_type_id_hotel_id_duration_hours_key";

-- AlterTable
ALTER TABLE "room_hourly_rates" DROP COLUMN "room_type_id";

-- CreateIndex
CREATE UNIQUE INDEX "room_hourly_rates_hotel_id_duration_hours_key" ON "room_hourly_rates"("hotel_id", "duration_hours");

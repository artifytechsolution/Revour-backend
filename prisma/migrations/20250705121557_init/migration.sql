/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `bills` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `hotels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `room_hourly_rates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `room_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bills_id_key" ON "bills"("id");

-- CreateIndex
CREATE UNIQUE INDEX "hotels_id_key" ON "hotels"("id");

-- CreateIndex
CREATE UNIQUE INDEX "room_hourly_rates_id_key" ON "room_hourly_rates"("id");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_id_key" ON "room_types"("id");

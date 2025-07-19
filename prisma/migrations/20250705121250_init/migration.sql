/*
  Warnings:

  - The required column `id` was added to the `bills` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `hotels` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `room_hourly_rates` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `room_types` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "room_hourly_rates" ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "room_types" ADD COLUMN     "id" TEXT NOT NULL;

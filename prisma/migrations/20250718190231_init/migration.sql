/*
  Warnings:

  - You are about to drop the column `valid_from` on the `room_hourly_rates` table. All the data in the column will be lost.
  - You are about to drop the column `valid_until` on the `room_hourly_rates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "room_hourly_rates" DROP COLUMN "valid_from",
DROP COLUMN "valid_until";

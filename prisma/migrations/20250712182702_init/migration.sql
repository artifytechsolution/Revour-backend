/*
  Warnings:

  - You are about to drop the `hotel_descriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "hotel_descriptions" DROP CONSTRAINT "hotel_descriptions_hotel_id_fkey";

-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "hotel_descriptions";

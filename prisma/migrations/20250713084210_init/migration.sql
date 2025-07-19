/*
  Warnings:

  - The primary key for the `hotel_ratings` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "hotel_ratings" DROP CONSTRAINT "hotel_ratings_pkey",
ALTER COLUMN "rating_id" DROP DEFAULT,
ALTER COLUMN "rating_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "hotel_ratings_pkey" PRIMARY KEY ("rating_id");
DROP SEQUENCE "hotel_ratings_rating_id_seq";

/*
  Warnings:

  - You are about to drop the `Hotelunavilable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hotelunavilable" DROP CONSTRAINT "Hotelunavilable_hotel_id_fkey";

-- DropTable
DROP TABLE "Hotelunavilable";

-- CreateTable
CREATE TABLE "hotel_unavailable" (
    "id" TEXT NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "check_in_datetime" TIMESTAMP(3) NOT NULL,
    "check_out_datetime" TIMESTAMP(3) NOT NULL,
    "total_days" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hotel_unavailable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hotel_unavailable" ADD CONSTRAINT "hotel_unavailable_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

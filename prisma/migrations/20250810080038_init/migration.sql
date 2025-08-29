/*
  Warnings:

  - The required column `id` was added to the `Hotelunavilable` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
CREATE SEQUENCE hotelunavilable_hotel_id_seq;
ALTER TABLE "Hotelunavilable" ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "hotel_id" SET DEFAULT nextval('hotelunavilable_hotel_id_seq');
ALTER SEQUENCE hotelunavilable_hotel_id_seq OWNED BY "Hotelunavilable"."hotel_id";

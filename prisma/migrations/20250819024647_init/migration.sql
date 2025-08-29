-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "experience_id" INTEGER,
ALTER COLUMN "hotel_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("experience_id") ON DELETE SET NULL ON UPDATE CASCADE;

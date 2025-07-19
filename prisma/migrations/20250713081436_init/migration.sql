-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "hotel_ratings" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'APPROVED';

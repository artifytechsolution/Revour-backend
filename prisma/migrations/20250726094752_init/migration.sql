-- AlterEnum
ALTER TYPE "OrderType" ADD VALUE 'Hours';

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "total_days" INTEGER DEFAULT 0;

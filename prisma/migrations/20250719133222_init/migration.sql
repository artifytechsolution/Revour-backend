/*
  Warnings:

  - The `payment_status` column on the `bills` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `payment_method` on the `bills` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[invoice_number]` on the table `bills` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `bills` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'CARD', 'NETBANKING', 'WALLET', 'EMI');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('HOTEL', 'EXPERIENCE', 'OTHER');

-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "base_amount" DECIMAL(10,2),
ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "discount_amount" DECIMAL(10,2),
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "invoice_number" VARCHAR(50),
ADD COLUMN     "notes" JSONB,
ADD COLUMN     "tax_amount" DECIMAL(10,2),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" "BillStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "payment_method" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_id" SERIAL NOT NULL,
    "reservation_id" INTEGER,
    "order_type" "OrderType" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "razorpay_order_id" VARCHAR(100) NOT NULL,
    "razorpay_payment_id" VARCHAR(100),
    "payment_method" "PaymentMethod",
    "amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2),
    "discount_amount" DECIMAL(10,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "webhook_status" VARCHAR(50),
    "subscription_id" VARCHAR(100),
    "notes" JSONB,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_razorpay_order_id_key" ON "orders"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "orders_reservation_id_idx" ON "orders"("reservation_id");

-- CreateIndex
CREATE INDEX "orders_razorpay_order_id_idx" ON "orders"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "bills_invoice_number_key" ON "bills"("invoice_number");

-- CreateIndex
CREATE INDEX "bills_reservation_id_idx" ON "bills"("reservation_id");

-- CreateIndex
CREATE INDEX "bills_user_id_idx" ON "bills"("user_id");

-- CreateIndex
CREATE INDEX "bills_payment_status_idx" ON "bills"("payment_status");

-- CreateIndex
CREATE INDEX "bills_invoice_number_idx" ON "bills"("invoice_number");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_idx" ON "reservations"("hotel_id");

-- CreateIndex
CREATE INDEX "reservations_user_id_idx" ON "reservations"("user_id");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

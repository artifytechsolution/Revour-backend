/*
  Warnings:

  - The values [Hours] on the enum `OrderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderType_new" AS ENUM ('HOTEL', 'EXPERIENCE', 'HOURS', 'OTHER');
ALTER TABLE "orders" ALTER COLUMN "order_type" TYPE "OrderType_new" USING ("order_type"::text::"OrderType_new");
ALTER TYPE "OrderType" RENAME TO "OrderType_old";
ALTER TYPE "OrderType_new" RENAME TO "OrderType";
DROP TYPE "OrderType_old";
COMMIT;

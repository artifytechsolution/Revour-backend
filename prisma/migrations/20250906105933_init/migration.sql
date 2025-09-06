/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `hotels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hotels_email_key" ON "hotels"("email");

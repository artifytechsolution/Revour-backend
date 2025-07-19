/*
  Warnings:

  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "experience_images" DROP CONSTRAINT "experience_images_experience_id_fkey";

-- DropForeignKey
ALTER TABLE "experience_rating" DROP CONSTRAINT "experience_rating_experience_id_fkey";

-- DropTable
DROP TABLE "Experience";

-- CreateTable
CREATE TABLE "experience" (
    "id" TEXT NOT NULL,
    "experience_id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "price" TEXT NOT NULL,
    "description" TEXT,
    "star_rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "experience_pkey" PRIMARY KEY ("experience_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "experience_id_key" ON "experience"("id");

-- CreateIndex
CREATE UNIQUE INDEX "experience_email_key" ON "experience"("email");

-- AddForeignKey
ALTER TABLE "experience_images" ADD CONSTRAINT "experience_images_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("experience_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_rating" ADD CONSTRAINT "experience_rating_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("experience_id") ON DELETE CASCADE ON UPDATE CASCADE;

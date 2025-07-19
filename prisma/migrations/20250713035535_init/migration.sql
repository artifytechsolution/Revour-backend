/*
  Warnings:

  - You are about to drop the `ExperienceImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExperienceRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExperienceImage" DROP CONSTRAINT "ExperienceImage_experience_id_fkey";

-- DropForeignKey
ALTER TABLE "ExperienceRating" DROP CONSTRAINT "ExperienceRating_experience_id_fkey";

-- DropForeignKey
ALTER TABLE "ExperienceRating" DROP CONSTRAINT "ExperienceRating_user_id_fkey";

-- DropTable
DROP TABLE "ExperienceImage";

-- DropTable
DROP TABLE "ExperienceRating";

-- CreateTable
CREATE TABLE "experience_images" (
    "image_id" SERIAL NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experience_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "experience_rating" (
    "rating_id" SERIAL NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "experience_rating_pkey" PRIMARY KEY ("rating_id")
);

-- AddForeignKey
ALTER TABLE "experience_images" ADD CONSTRAINT "experience_images_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experience"("experience_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_rating" ADD CONSTRAINT "experience_rating_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experience"("experience_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_rating" ADD CONSTRAINT "experience_rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

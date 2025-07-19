-- CreateTable
CREATE TABLE "Experience" (
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

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("experience_id")
);

-- CreateTable
CREATE TABLE "ExperienceImage" (
    "image_id" SERIAL NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceImage_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "ExperienceRating" (
    "rating_id" SERIAL NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExperienceRating_pkey" PRIMARY KEY ("rating_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Experience_id_key" ON "Experience"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_email_key" ON "Experience"("email");

-- AddForeignKey
ALTER TABLE "ExperienceImage" ADD CONSTRAINT "ExperienceImage_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experience"("experience_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceRating" ADD CONSTRAINT "ExperienceRating_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experience"("experience_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceRating" ADD CONSTRAINT "ExperienceRating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Hotelunavilable" (
    "hotel_id" INTEGER NOT NULL,
    "check_in_datetime" TIMESTAMP(3),
    "check_out_datetime" TIMESTAMP(3),
    "total_days" INTEGER DEFAULT 0,

    CONSTRAINT "Hotelunavilable_pkey" PRIMARY KEY ("hotel_id")
);

-- CreateIndex
CREATE INDEX "Hotelunavilable_hotel_id_idx" ON "Hotelunavilable"("hotel_id");

-- AddForeignKey
ALTER TABLE "Hotelunavilable" ADD CONSTRAINT "Hotelunavilable_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("hotel_id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `hospital_id` on the `doctors` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_hospital_id_fkey";

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "hospital_id";

-- CreateTable
CREATE TABLE "doctor_hospitals" (
    "id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "speciality" TEXT NOT NULL,

    CONSTRAINT "doctor_hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_hospitals_hospital_id_doctor_id_key" ON "doctor_hospitals"("hospital_id", "doctor_id");

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

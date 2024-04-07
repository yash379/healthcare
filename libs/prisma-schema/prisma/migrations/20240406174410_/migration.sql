/*
  Warnings:

  - A unique constraint covering the columns `[digital_health_code]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "patients_digital_health_code_hospital_id_key";

-- AlterTable
ALTER TABLE "doctor_hospitals" ADD COLUMN     "patientId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "patients_digital_health_code_key" ON "patients"("digital_health_code");

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

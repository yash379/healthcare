/*
  Warnings:

  - You are about to drop the column `patientId` on the `doctor_hospitals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[digital_health_code,hospital_id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "doctor_hospitals" DROP CONSTRAINT "doctor_hospitals_patientId_fkey";

-- DropIndex
DROP INDEX "patients_digital_health_code_key";

-- AlterTable
ALTER TABLE "doctor_hospitals" DROP COLUMN "patientId";

-- CreateIndex
CREATE UNIQUE INDEX "patients_digital_health_code_hospital_id_key" ON "patients"("digital_health_code", "hospital_id");

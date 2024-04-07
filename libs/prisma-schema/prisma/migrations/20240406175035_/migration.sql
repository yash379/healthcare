/*
  Warnings:

  - You are about to drop the column `hospital_id` on the `patients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[digital_health_code]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "patients_digital_health_code_hospital_id_key";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "hospital_id";

-- CreateIndex
CREATE UNIQUE INDEX "patients_digital_health_code_key" ON "patients"("digital_health_code");

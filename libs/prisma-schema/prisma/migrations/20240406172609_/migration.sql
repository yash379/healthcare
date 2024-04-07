/*
  Warnings:

  - A unique constraint covering the columns `[digital_health_code,hospital_id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "patients_digital_health_code_key";

-- CreateTable
CREATE TABLE "patient_hospitals" (
    "id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "digitalHealthCode" TEXT NOT NULL,

    CONSTRAINT "patient_hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_hospitals_hospital_id_patient_id_key" ON "patient_hospitals"("hospital_id", "patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_digital_health_code_hospital_id_key" ON "patients"("digital_health_code", "hospital_id");

-- AddForeignKey
ALTER TABLE "patient_hospitals" ADD CONSTRAINT "patient_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_hospitals" ADD CONSTRAINT "patient_hospitals_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

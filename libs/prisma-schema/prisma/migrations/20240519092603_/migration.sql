/*
  Warnings:

  - You are about to drop the column `hospitalId` on the `admins` table. All the data in the column will be lost.
  - The primary key for the `doctor_patients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doctorId` on the `doctor_patients` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `doctor_patients` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `patients` table. All the data in the column will be lost.
  - Added the required column `doctor_id` to the `doctor_patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `doctor_patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_patients" DROP CONSTRAINT "doctor_patients_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_patients" DROP CONSTRAINT "doctor_patients_patientId_fkey";

-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_hospitalId_fkey";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "hospitalId";

-- AlterTable
ALTER TABLE "doctor_patients" DROP CONSTRAINT "doctor_patients_pkey",
DROP COLUMN "doctorId",
DROP COLUMN "patientId",
ADD COLUMN     "doctor_id" INTEGER NOT NULL,
ADD COLUMN     "patient_id" INTEGER NOT NULL,
ADD CONSTRAINT "doctor_patients_pkey" PRIMARY KEY ("doctor_id", "patient_id");

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "hospitalId";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "hospitalId";

-- CreateTable
CREATE TABLE "doctor_hospitals" (
    "doctor_id" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL,

    CONSTRAINT "doctor_hospitals_pkey" PRIMARY KEY ("doctor_id","hospital_id")
);

-- CreateTable
CREATE TABLE "patient_hospitals" (
    "patient_id" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL,

    CONSTRAINT "patient_hospitals_pkey" PRIMARY KEY ("patient_id","hospital_id")
);

-- CreateTable
CREATE TABLE "admin_hospitals" (
    "admin_id" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL,

    CONSTRAINT "admin_hospitals_pkey" PRIMARY KEY ("admin_id","hospital_id")
);

-- CreateTable
CREATE TABLE "_DoctorHospitals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PatientHospitals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminHospitals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorHospitals_AB_unique" ON "_DoctorHospitals"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorHospitals_B_index" ON "_DoctorHospitals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PatientHospitals_AB_unique" ON "_PatientHospitals"("A", "B");

-- CreateIndex
CREATE INDEX "_PatientHospitals_B_index" ON "_PatientHospitals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminHospitals_AB_unique" ON "_AdminHospitals"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminHospitals_B_index" ON "_AdminHospitals"("B");

-- AddForeignKey
ALTER TABLE "doctor_patients" ADD CONSTRAINT "doctor_patients_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_patients" ADD CONSTRAINT "doctor_patients_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_hospitals" ADD CONSTRAINT "patient_hospitals_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_hospitals" ADD CONSTRAINT "patient_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_hospitals" ADD CONSTRAINT "admin_hospitals_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_hospitals" ADD CONSTRAINT "admin_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorHospitals" ADD CONSTRAINT "_DoctorHospitals_A_fkey" FOREIGN KEY ("A") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorHospitals" ADD CONSTRAINT "_DoctorHospitals_B_fkey" FOREIGN KEY ("B") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientHospitals" ADD CONSTRAINT "_PatientHospitals_A_fkey" FOREIGN KEY ("A") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientHospitals" ADD CONSTRAINT "_PatientHospitals_B_fkey" FOREIGN KEY ("B") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminHospitals" ADD CONSTRAINT "_AdminHospitals_A_fkey" FOREIGN KEY ("A") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminHospitals" ADD CONSTRAINT "_AdminHospitals_B_fkey" FOREIGN KEY ("B") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

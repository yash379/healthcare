/*
  Warnings:

  - The values [OTHERS] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `email` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `address_line_1` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `address_line_2` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the `doctor_hospitals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hospital_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_hospitals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `super_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_hospital_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_organization_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_super_roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hospitalId` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine1` to the `hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE', 'OTHER');
ALTER TABLE "doctors" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TABLE "patients" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "doctor_hospitals" DROP CONSTRAINT "doctor_hospitals_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_hospitals" DROP CONSTRAINT "doctor_hospitals_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "patient_hospitals" DROP CONSTRAINT "patient_hospitals_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "patient_hospitals" DROP CONSTRAINT "patient_hospitals_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "site_groups" DROP CONSTRAINT "site_groups_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "sites" DROP CONSTRAINT "sites_site_group_id_fkey";

-- DropForeignKey
ALTER TABLE "users_hospital_roles" DROP CONSTRAINT "users_hospital_roles_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "users_hospital_roles" DROP CONSTRAINT "users_hospital_roles_hospital_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users_hospital_roles" DROP CONSTRAINT "users_hospital_roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_organization_roles" DROP CONSTRAINT "users_organization_roles_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "users_organization_roles" DROP CONSTRAINT "users_organization_roles_organization_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users_organization_roles" DROP CONSTRAINT "users_organization_roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_super_roles" DROP CONSTRAINT "users_super_roles_super_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users_super_roles" DROP CONSTRAINT "users_super_roles_user_id_fkey";

-- DropIndex
DROP INDEX "doctors_email_key";

-- DropIndex
DROP INDEX "patients_email_key";

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "is_active",
DROP COLUMN "last_name",
DROP COLUMN "password",
DROP COLUMN "phone_number",
DROP COLUMN "token",
ADD COLUMN     "hospitalId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "hospitals" DROP COLUMN "address_line_1",
DROP COLUMN "address_line_2",
DROP COLUMN "phone_number",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "phone_number",
ADD COLUMN     "hospitalId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "doctor_hospitals";

-- DropTable
DROP TABLE "hospital_roles";

-- DropTable
DROP TABLE "organization_roles";

-- DropTable
DROP TABLE "organizations";

-- DropTable
DROP TABLE "patient_hospitals";

-- DropTable
DROP TABLE "site_groups";

-- DropTable
DROP TABLE "sites";

-- DropTable
DROP TABLE "super_roles";

-- DropTable
DROP TABLE "users_hospital_roles";

-- DropTable
DROP TABLE "users_organization_roles";

-- DropTable
DROP TABLE "users_super_roles";

-- DropEnum
DROP TYPE "HospitalRoleName";

-- DropEnum
DROP TYPE "OrganizationRoleName";

-- DropEnum
DROP TYPE "SuperRoleName";

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_patients" (
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "doctor_patients_pkey" PRIMARY KEY ("doctorId","patientId")
);

-- CreateTable
CREATE TABLE "_DoctorPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_userId_key" ON "super_admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorPatient_AB_unique" ON "_DoctorPatient"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorPatient_B_index" ON "_DoctorPatient"("B");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super_admins" ADD CONSTRAINT "super_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_patients" ADD CONSTRAINT "doctor_patients_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_patients" ADD CONSTRAINT "doctor_patients_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorPatient" ADD CONSTRAINT "_DoctorPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorPatient" ADD CONSTRAINT "_DoctorPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

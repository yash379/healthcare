/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SuperRoleName" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "HospitalRoleName" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "super_roles" (
    "id" SERIAL NOT NULL,
    "name" "SuperRoleName" NOT NULL,

    CONSTRAINT "super_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital_roles" (
    "id" SERIAL NOT NULL,
    "name" "HospitalRoleName" NOT NULL,

    CONSTRAINT "hospital_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_super_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "super_role_id" INTEGER NOT NULL,

    CONSTRAINT "users_super_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_hospital_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hospital_role_id" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL,

    CONSTRAINT "users_hospital_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super_roles_name_key" ON "super_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_roles_name_key" ON "hospital_roles"("name");

-- AddForeignKey
ALTER TABLE "users_super_roles" ADD CONSTRAINT "users_super_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_super_roles" ADD CONSTRAINT "users_super_roles_super_role_id_fkey" FOREIGN KEY ("super_role_id") REFERENCES "super_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_hospital_roles" ADD CONSTRAINT "users_hospital_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_hospital_roles" ADD CONSTRAINT "users_hospital_roles_hospital_role_id_fkey" FOREIGN KEY ("hospital_role_id") REFERENCES "hospital_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_hospital_roles" ADD CONSTRAINT "users_hospital_roles_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

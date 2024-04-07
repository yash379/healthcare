-- CreateEnum
CREATE TYPE "SuperRoleName" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "OrganizationRoleName" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "HospitalRoleName" AS ENUM ('ADMIN', 'DOCTOR', 'STAFF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "state_code" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "site_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "site_group_id" INTEGER NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
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
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_hospital_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_organization_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_role_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "users_organization_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_roles" (
    "id" SERIAL NOT NULL,
    "name" "OrganizationRoleName" NOT NULL,

    CONSTRAINT "organization_roles_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "hospitals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "state_code" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_hospitals" (
    "id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "speciality" TEXT NOT NULL,

    CONSTRAINT "doctor_hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "doctor_code" TEXT NOT NULL,
    "speciality" TEXT NOT NULL,
    "phone_number" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "password" TEXT,
    "token" TEXT,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_hospitals" (
    "id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "digitalHealthCode" TEXT NOT NULL,

    CONSTRAINT "patient_hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "blood_group" TEXT NOT NULL,
    "dob" TIMESTAMPTZ NOT NULL,
    "digital_health_code" TEXT NOT NULL,
    "phone_number" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "state_code" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_name_key" ON "organization_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "super_roles_name_key" ON "super_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_roles_name_key" ON "hospital_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_code_key" ON "hospitals"("code");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_hospitals_hospital_id_doctor_id_key" ON "doctor_hospitals"("hospital_id", "doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_doctor_code_key" ON "doctors"("doctor_code");

-- CreateIndex
CREATE UNIQUE INDEX "patient_hospitals_hospital_id_patient_id_key" ON "patient_hospitals"("hospital_id", "patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_digital_health_code_key" ON "patients"("digital_health_code");

-- AddForeignKey
ALTER TABLE "site_groups" ADD CONSTRAINT "site_groups_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_site_group_id_fkey" FOREIGN KEY ("site_group_id") REFERENCES "site_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_super_roles" ADD CONSTRAINT "users_super_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_super_roles" ADD CONSTRAINT "users_super_roles_super_role_id_fkey" FOREIGN KEY ("super_role_id") REFERENCES "super_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_hospital_roles" ADD CONSTRAINT "users_hospital_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_hospital_roles" ADD CONSTRAINT "users_hospital_roles_hospital_role_id_fkey" FOREIGN KEY ("hospital_role_id") REFERENCES "hospital_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_hospital_roles" ADD CONSTRAINT "users_hospital_roles_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_organization_roles" ADD CONSTRAINT "users_organization_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_organization_roles" ADD CONSTRAINT "users_organization_roles_organization_role_id_fkey" FOREIGN KEY ("organization_role_id") REFERENCES "organization_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_organization_roles" ADD CONSTRAINT "users_organization_roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_hospitals" ADD CONSTRAINT "patient_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_hospitals" ADD CONSTRAINT "patient_hospitals_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

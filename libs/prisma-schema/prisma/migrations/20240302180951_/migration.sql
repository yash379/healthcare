-- CreateEnum
CREATE TYPE "SuperRoleName" AS ENUM ('ADMIN');

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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "super_roles_name_key" ON "super_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_roles_name_key" ON "hospital_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_code_key" ON "hospitals"("code");

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

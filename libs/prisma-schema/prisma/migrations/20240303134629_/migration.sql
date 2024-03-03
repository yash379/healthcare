-- CreateEnum
CREATE TYPE "OrganizationRoleName" AS ENUM ('ADMIN');

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
    "password" TEXT,
    "token" TEXT,
    "hospital_id" INTEGER NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
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
    "hospital_id" INTEGER NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_doctor_code_key" ON "doctors"("doctor_code");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_digital_health_code_key" ON "patients"("digital_health_code");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {  CreatePrescriptionsWrapperDto } from './dto/create-prescription-dto';
import { UpdatePrescriptionDto } from './dto/update-prescription-dto';
import { PrismaClient } from '@prisma/client';
import { ListPrescriptionPageDto } from './dto/list-prescription-page.dto';
import { ViewPrescriptionDto } from './dto/view-prescription.dto';

@Injectable()
export class PrescriptionService {
  private prisma = new PrismaClient();

  // async create(dto: CreatePrescriptionDto) {
  //   const doctorPatient = await this.prisma.doctorPatient.findUnique({
  //     where: {
  //       doctorId_patientId: {
  //         patientId: dto.patientId,
  //         doctorId: dto.doctorId
  //       },
  //     },
  //   });

  //   if (!doctorPatient) {
  //     throw new BadRequestException('Doctor and Patient are not associated.');
  //   }

  //   const prescriptionDate = new Date(dto.prescriptionDate);

  //   return this.prisma.prescription.create({
  //     data: {
  //       ...dto,
  //       prescriptionDate,
  //     },
  //   });
  // }

  async create(dto: CreatePrescriptionsWrapperDto) {
    for (const prescription of dto.prescriptions) {
      if (!prescription.doctorId || !prescription.patientId) {
        throw new BadRequestException('Doctor ID and Patient ID must be provided.');
      }

      console.log(`Processing prescription for Doctor ID: ${prescription.doctorId}, Patient ID: ${prescription.patientId}`);
  
      const doctorPatient = await this.prisma.doctorPatient.findUnique({
        where: {
          doctorId_patientId: {
            doctorId: prescription.doctorId,
            patientId: prescription.patientId,
          },
        },
      });
  
      if (!doctorPatient) {
        throw new BadRequestException('Doctor and Patient are not associated.');
      }
  
      const prescriptionDate = new Date(prescription.prescriptionDate);
  
      // First, create the prescription
      const createdPrescription = await this.prisma.prescription.create({
        data: {
          doctorId: prescription.doctorId,
          patientId: prescription.patientId,
          prescriptionDate: prescriptionDate,
          medicalHistoryId: prescription.medicalHistoryId || null,
        },
      });
  
      // If the prescription contains medicines, insert them
      if (prescription.medicines && prescription.medicines.length > 0) {
        for (const medicine of prescription.medicines) {
          await this.prisma.medicine.create({
            data: {
              prescriptionId: createdPrescription.id, // link the medicine to the prescription
              medicineName: medicine.medicineName,
              instructions: medicine.instructions,
              dose: medicine.dose,
              when: medicine.when,
              frequency: medicine.frequency,
              duration: medicine.duration,
            },
          });
        }
      }
    }
  
    return { message: 'Prescriptions and medicines created successfully' };
  }
  
  

  async update(id: number, dto: UpdatePrescriptionDto) {
    const data: any = { ...dto };
    if (dto.prescriptionDate) {
      data.prescriptionDate = new Date(dto.prescriptionDate);
    }

    return this.prisma.prescription.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.prescription.delete({
      where: { id },
    });
  }

  // async getById(id: number) {
  //   const prescription = await this.prisma.prescription.findUnique({
  //     where: { id },
  //   });

  //   if (!prescription) {
  //     throw new NotFoundException('Prescription not found.');
  //   }

  //   return {
  //     ...prescription,
  //     prescriptionDate: prescription.prescriptionDate.toISOString(),
  //   };
  // }

  async getById(id: number): Promise<ViewPrescriptionDto> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        medicines: true,
      },
    });
  
    if (!prescription) {
      throw new NotFoundException('Prescription not found.');
    }
  
    return {
      ...prescription,
      prescriptionDate: prescription.prescriptionDate.toISOString(),
      medicines: prescription.medicines.map((medicine) => ({
        id: medicine.id,
        medicineName: medicine.medicineName,
        instructions: medicine.instructions,
        dose: medicine.dose,
        when: medicine.when,
        frequency: medicine.frequency,
        duration: medicine.duration,
        prescriptionId: medicine.prescriptionId,
      })),
    }
  }

  async getAll( 
    pageSize: number,
    pageOffset: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListPrescriptionPageDto> {


    const whereArray = [];
    let whereQuery = {};
    // whereArray.push({
    //   superRoles: {
    //     some: {
    //       superRoleId: hospitalAdminRoleId.id,
    //     },
    //   },
    // });


    if (whereArray.length > 0) {
      if (whereArray.length > 1) {
        whereQuery = { AND: whereArray };
      } else {
        whereQuery = whereArray[0];
      }
    }

    const sort = (sortBy ? sortBy : 'id').toString();
    const order = sortOrder ? sortOrder : 'asc';
    const size = pageSize ? pageSize : 10;
    const offset = pageOffset ? pageOffset : 0;
    const orderBy = { [sort]: order };
    const count = await this.prisma.prescription.count({
      where: whereQuery,
    });


    const prescriptions = await this.prisma.prescription.findMany({
      include: {
        medicines: true,
      },

      take: Number(size),
      skip: Number(size * offset),
      orderBy,
    });
  
    return {
      size: size,
      number: offset,
      total: count,
      sort: [
        {
          by: sort,
          order: order,
        },
      ],
      content: prescriptions.map((prescription) => ({
      ...prescription,
      prescriptionDate: prescription.prescriptionDate.toISOString(), 
      medicines: prescription.medicines.map((medicine) => ({
        ...medicine,
      })),
    })),
  };
  }

}

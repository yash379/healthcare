import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorDto } from './dto/doctors.dto';
import { PrismaClient, DoctorHospital, Gender } from '@prisma/client';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { ViewDoctorDto } from './dto/view-doctor.dto';
import { ListDoctorPageDto } from './dto/list-doctor-page.dto';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';

@Injectable()
export class DoctorsService {
  private prisma = new PrismaClient();

  // async exportDoctorsDetailsForHospital(hospitalId: number) {
  //   const hospital = await this.prisma.hospital.findFirst({
  //     where: {
  //       id: hospitalId
  //     }
  //   })

  //   if (!hospital) throw new HttpException("hospital not found", HttpStatus.NOT_FOUND);

  //   // generate doctor data for the hospital where the doctor is associated for the hospital
  //   const doctors = await this.prisma.doctor.findMany({
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       doctorCode: true,
  //       gender: true,
  //       email: true,
  //       phoneNumber: true,
  //       speciality: true,

  //       isActive: true,
  //       hospitals: {
  //         select: {
  //           hospital: {
  //             select: {
  //               id: true,
  //               name: true

  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //     where: {
  //     some: {
  //       hospital: {
  //         id: hospitalId
  //       }
  //     }
  //   }
  //   )

  //   const data = [
  //     ['Id', 'FirstName', 'LastName', 'Email', "Phone Number", "Is Child", "Is Active"],
  //   ];

  //   residents.map((resident) => {
  //     data.push([String(resident.id), resident.name, resident.email, String(resident.isChild), String(resident.isActive), resident.flats[0].flat.number, resident.flats[0].flat.floor.number, resident.flats[0].flat.floor.building.name])
  //   })

  //   return data;
  // }

  // async bulkUploadResidentData(societyId: number, fileDto: FileDto, file) {
  //   const society = await this.prisma.society.findFirst({
  //     where: {
  //       id: societyId
  //     }
  //   })
  //   if (!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

  //   const workbook = xlsx.read(file.buffer);
  //   const sheetNames = workbook.SheetNames;
  //   const sheet = workbook.Sheets[sheetNames[0]];

  //   const jsonData = xlsx.utils.sheet_to_json(sheet);

  //   try {

  //     this.prisma.$transaction(async (tx) => {

  //       let buildingId: number;
  //       let floorId: number;
  //       let flatId: number;
  //       let residentId: number;

  //       console.log("inside the transection");
  //       for (const flatData of jsonData) {

  //         // section for create building if not exist..
  //         console.log(flatData);
  //         const building = await tx.building.findFirst({
  //           where: {
  //             societyId: societyId,
  //             name: flatData['Building Name']
  //           }
  //         });
  //         if (!building) {
  //           const newbuilding = await tx.building.create({
  //             data: {
  //               'name': flatData['Building Name'],
  //               'isActive': true,
  //               'societyId': societyId
  //             }
  //           });

  //           buildingId = newbuilding.id;
  //         } else {
  //           buildingId = building.id;
  //         }

  //         //section for creating floor if not exist.

  //         const floor = await tx.floor.findFirst({
  //           where: {
  //             number: flatData['Floor Number'],
  //             buildingId: buildingId
  //           }
  //         });

  //         if (!floor) {
  //           const newFloor = await tx.floor.create({
  //             data: {
  //               'number': flatData['Floor Number'],
  //               "buildingId": buildingId,
  //               "isActive": true
  //             }
  //           });
  //           floorId = newFloor.id
  //         } else {
  //           floorId = floor.id;
  //         }

  //         //Section for creating flat if not exist.
  //         const flat = await tx.flat.findFirst({
  //           where: {
  //             floorId: floorId,
  //             number: flatData['Flat Number'],
  //           }
  //         })
  //         if (!flat) {
  //           const newFlat = await tx.flat.create({
  //             data: {
  //               number: flatData['Flat Number'],
  //               floorId: floorId,
  //               isActive: true
  //             }
  //           });
  //           flatId = newFlat.id;
  //           if (!newFlat) {
  //             throw new HttpException("transection error while creating flat please recheck the excel sheet", HttpStatus.CONFLICT);
  //           }
  //         } else {
  //           flatId = flat.id;
  //         }

  //         //Section for creating resident if not exist.
  //         const resident = await tx.resident.findFirst({
  //           where: {
  //             name: flatData['Name'],
  //             email: flatData['Email'],
  //             phoneNumber: String(flatData['Phone Number']),
  //             isChild: Boolean(flatData['Is Child?']),
  //           }
  //         })

  //         if (!resident) {
  //           const newResident = await tx.resident.create({
  //             data: {
  //               name: flatData['Name'],
  //               email: flatData['Email'],
  //               phoneNumber: String(flatData['Phone Number']),
  //               isChild: Boolean(flatData['Is Child?']),
  //               isActive: true
  //             }
  //           });
  //           residentId = newResident.id;

  //           const addResidentFlat = await tx.residentFlat.create({
  //             data: {
  //               flatId: flatId,
  //               residentId: residentId,
  //               type: flatData['Type'],
  //               isPrimary: Boolean(flatData['Is Primary?']),

  //             },
  //           });
  //         }
  //       }

  //     })

  //   } catch (error) {
  //     throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED)
  //   }

  //   return 'accepted';

  // }

  // async bulkUploadResidentsData(societyId: number, buildingId: number, floorId: number, flatId: number, fileDto: FileDto, file) {
  //   const society = await this.prisma.society.findFirst({
  //     where: {
  //       id: societyId
  //     }
  //   })
  //   if (!society) throw new HttpException("society not found", HttpStatus.NOT_FOUND);

  //   const building = await this.prisma.building.findFirst({
  //     where: {
  //       AND: [
  //         { id: buildingId },
  //         { societyId: societyId }
  //       ]
  //     }
  //   })

  //   if (!building) throw new HttpException("building not found", HttpStatus.NOT_FOUND);

  //   const floor = await this.prisma.floor.findFirst({
  //     where: {
  //       buildingId: buildingId,
  //       id: floorId,
  //     }
  //   })

  //   if (!floor) throw new HttpException("floor not found", HttpStatus.NOT_FOUND);

  //   const flat = await this.prisma.flat.findFirst({
  //     where: {
  //       floorId: floorId,
  //       id: flatId,
  //     }
  //   })

  //   if (!flat) throw new HttpException("flat not found", HttpStatus.NOT_FOUND);

  //   const workbook = xlsx.read(file.buffer);
  //   const sheetNames = workbook.SheetNames;
  //   const sheet = workbook.Sheets[sheetNames[0]];

  //   const jsonData = xlsx.utils.sheet_to_json(sheet);

  //   jsonData.map(async (resident) => {
  //     const res = await this.prisma.resident.create({
  //       data: {
  //         name: resident['name'],
  //         email: resident["email"],
  //         phoneNumber: String(resident['phoneNumber']),
  //         isChild: resident['isChild'],
  //         isActive: true
  //       }
  //     })

  //     const addResidentFlat = await this.prisma.residentFlat.create({
  //       data: {
  //         flatId: flatId,
  //         residentId: res.id,
  //         type: resident['type'],
  //         isPrimary: resident['isPrimary'],
  //       },
  //     });
  //   })

  //   return "ok";

  // }

  isValidMobileNumber(mobileNumber: string): boolean {
    // Define a regex pattern for a 10-digit mobile number
    const pattern = /^[0-9]{10}$/;

    // Test the provided mobile number against the pattern
    return pattern.test(mobileNumber);
  }

  // async add(
  //   hospitalId: number,
  //   addDoctordto: AddDoctorDto
  // ): Promise<DoctorDto> {
  //   if (Number.isNaN(hospitalId)) {
  //     throw new HttpException(
  //       'Hospital id is missing in params',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  //   // TODO: implement transaction

  //   const hospital = await this.prisma.hospital.findUnique({
  //     where: {
  //       id: hospitalId,
  //     },
  //   });
  //   console.log(hospital);
  //   if (!hospital) {
  //     throw new HttpException(
  //       'hospital not found check hospitalId',
  //       HttpStatus.NOT_FOUND
  //     );
  //   }

  //   const isPhoneNumberValid = this.isValidMobileNumber(
  //     addDoctordto.phoneNumber
  //   );

  //   if (!isPhoneNumberValid) {
  //     throw new HttpException(
  //       `${addDoctordto.phoneNumber} is a valid 10-digit mobile number.`,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  //   const doctor = await this.prisma.doctor.findFirst({
  //     where: {
  //       firstName: addDoctordto.firstName,
  //       lastName: addDoctordto.lastName,
  //       speciality: addDoctordto.speciality,
  //       gender: addDoctordto.gender,
  //       email: addDoctordto.email,
  //       phoneNumber: addDoctordto.phoneNumber,
  //       isActive: addDoctordto.isActive,
  //     },
  //   });
  //   if (doctor) {
  //     const doctorHospital = await this.prisma.doctorHospital.findFirst({
  //       where: {
  //         hospitalId: hospitalId,
  //         doctorId: doctor.id,
  //       },
  //     });
  //     if (doctorHospital) {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.BAD_REQUEST,
  //           error: 'Doctor already exists',
  //         },
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }
  //     const checkHospital = await this.prisma.hospital.findFirst({
  //       where: { id: hospitalId },
  //     });
  //     if (!checkHospital) {
  //       throw new NotFoundException();
  //     } else {
  //       const { gender } = addDoctordto;
  //       const addDoctorData = {
  //         hospitalId: hospitalId,
  //         doctorId: doctor.id,
  //         // firstName: doctor.firstName,
  //         // lastName: doctor.lastName,
  //         // email: doctor.email,
  //         // phoneNumber: doctor.phoneNumber,
  //         speciality: doctor.speciality,
  //         // doctorCode: doctor.doctorCode,
  //         // gender: doctor.gender,
  //       };
  //       console.log(addDoctorData);
  //       // const addDoctorHospital = await this.prisma.doctorHospital.create({
  //       //   data: addDoctorData,
  //       // });
  //       // if (addDoctorData.isPrimary) {
  //       //   // set other residents of this flat as not primary
  //       //   await this.prisma.residentFlat.updateMany({
  //       //     where: { flatId: flatId, residentId: { not: resident.id } },
  //       //     data: { isPrimary: false },
  //       //   });
  //       // }
  //       return {
  //         id: doctor.id,
  //         firstName: doctor.firstName,
  //         lastName: doctor.lastName,
  //         email: doctor.email,
  //         phoneNumber: doctor.phoneNumber,
  //         speciality: doctor.speciality,
  //         gender: doctor.gender,
  //         doctorCode: doctor.doctorCode,
  //         // hospitalId:addDoctorHospital.hospitalId,
  //         isActive: doctor.isActive,
  //       };
  //     }
  //   }

  //   const checkHospital = await this.prisma.hospital.findFirst({
  //     where: { id: hospitalId },
  //   });
  //   if (!checkHospital) {
  //     throw new NotFoundException();
  //   } else {
  //     const { gender, ...addDoctorDto } = addDoctordto;
  //     const addDoctor = await this.prisma.doctor.create({
  //       data: {
  //         firstName: addDoctorDto.firstName,
  //         lastName: addDoctorDto.lastName,
  //         email: addDoctorDto.email,
  //         phoneNumber: addDoctorDto.phoneNumber,
  //         doctorCode: addDoctorDto.doctorCode,
  //         gender: gender,
  //         speciality: addDoctorDto.speciality,
  //         isActive: addDoctorDto.isActive,
  //         hospitals: {
  //           create: [
  //             {
  //               hospitalId: hospitalId,
  //               speciality: addDoctorDto.speciality,
  //             },
  //           ],
  //         },
  //       },
  //     });
  //     const addDoctorData = {
  //       hospitalId: hospitalId,
  //       doctorId: addDoctor.id,
  //       // gender: gender,
  //       // firstName: addDoctorDto.firstName,
  //       // lastName: addDoctorDto.lastName,
  //       // email: addDoctorDto.email,
  //       // phoneNumber: addDoctorDto.phoneNumber,
  //       // doctorCode: addDoctorDto.doctorCode,
  //       speciality: addDoctorDto.speciality,
  //       // gender:gender,
  //       // isActive: addDoctorDto.isActive
  //     };
  //     const addDoctorHospital = await this.prisma.doctorHospital.create({
  //       data: addDoctorData,
  //     });
  //     // if (addResidentData.isPrimary) {
  //     //   // set other residents of this flat as not primary
  //     //   await this.prisma.residentFlat.updateMany({
  //     //     where: { flatId: flatId, residentId: { not: addResident.id } },
  //     //     data: { isPrimary: false },
  //     //   });
  //     // }
  //     return {
  //       id: addDoctor.id,
  //       firstName: addDoctor.firstName,
  //       lastName: addDoctor.lastName,
  //       email: addDoctor.email,
  //       phoneNumber: addDoctor.phoneNumber,
  //       gender: addDoctor.gender,
  //       speciality: addDoctor.speciality,
  //       doctorCode: addDoctor.doctorCode,
  //       isActive: addDoctor.isActive,
  //     };
  //   }
  // }

  async add(
    hospitalId: number,
    addDoctordto: AddDoctorDto
  ): Promise<DoctorDto> {
    if (Number.isNaN(hospitalId)) {
      throw new HttpException(
        'Hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }
  
    // Check if hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: {
        id: hospitalId,
      },
    });
    if (!hospital) {
      throw new HttpException(
        'Hospital not found, check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }
  
    // Check if phone number is valid
    const isPhoneNumberValid = this.isValidMobileNumber(
      addDoctordto.phoneNumber
    );
    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${addDoctordto.phoneNumber} is not a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }
  
    // Check if doctor already exists
    let doctor = await this.prisma.doctor.findFirst({
      where: {
        firstName: addDoctordto.firstName,
        lastName: addDoctordto.lastName,
        speciality: addDoctordto.speciality,
        gender: addDoctordto.gender,
        email: addDoctordto.email,
        phoneNumber: addDoctordto.phoneNumber,
        isActive: addDoctordto.isActive,
      },
    });
  
    // If doctor doesn't exist, create a new one
    if (!doctor) {
      doctor = await this.prisma.doctor.create({
        data: {
          firstName: addDoctordto.firstName,
          lastName: addDoctordto.lastName,
          email: addDoctordto.email,
          phoneNumber: addDoctordto.phoneNumber,
          doctorCode: addDoctordto.doctorCode,
          gender: addDoctordto.gender,
          speciality: addDoctordto.speciality,
          isActive: addDoctordto.isActive,
        },
      });
    }
  
    // Check if doctorHospital entry already exists
    const existingDoctorHospital = await this.prisma.doctorHospital.findFirst({
      where: {
        hospitalId: hospitalId,
        doctorId: doctor.id,
      },
    });
  
    // If doctorHospital entry already exists, throw an error
    if (existingDoctorHospital) {
      throw new HttpException(
        'Doctor is already associated with this hospital',
        HttpStatus.BAD_REQUEST
      );
    }
  
    // Create doctorHospital entry
    const addDoctorHospital = await this.prisma.doctorHospital.create({
      data: {
        hospitalId: hospitalId,
        doctorId: doctor.id,
        speciality: doctor.speciality,
      },
    });
  
    // Return doctor details
    return {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      speciality: doctor.speciality,
      gender: doctor.gender,
      doctorCode: doctor.doctorCode,
      isActive: doctor.isActive,
    };
  }
  

  async findByIdForSwitch(id: number): Promise<DoctorDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        isActive: true,
        speciality: true,
        doctorCode: true,
        gender: true,
      },
    });
    console.log(doctor);
    if (!doctor) {
      throw new NotFoundException();
    }
    if (!doctor.isActive)
      throw new HttpException('doctor is inactive', HttpStatus.BAD_REQUEST);

    const viewDoctor = {
      id: doctor.id,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      isActive: doctor.isActive,
      speciality: doctor.speciality,
      doctorCode: doctor.doctorCode,
      gender: doctor.gender,
    };
    return viewDoctor;
  }

  async findByEmail(email: string) {
    console.log(email)
    const doctor = await this.prisma.doctor.findFirst({
      where: { email },
      select: { id: true, email: true, password: true, firstName: true },
    });
    console.log("doctor password",doctor.password)
    if (!doctor) {
      throw new NotFoundException();
    }
    return doctor;
  }

  async findById(
    hospitalId: number,
    id: number
    // userId: number
  ): Promise<ViewDoctorDto> {
    if (Number.isNaN(hospitalId) || Number.isNaN(id)) {
      throw new HttpException(
        'hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const hospital = await this.prisma.hospital.findUnique({
      where: {
        id: hospitalId,
      },
      select: {
        doctors: {
          where: {
            id: id,
          },
        },
      },
    });
    if (!hospital) {
      throw new HttpException(
        'hospital not found check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }

    const doctorview = await this.prisma.doctor.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        speciality: true,
        gender: true,
        doctorCode: true,
        isActive: true,
      },
    });
    if (!doctorview) {
      throw new NotFoundException();
    } else {
      if (doctorview.isActive) {
        return doctorview;
      } else {
        throw new NotFoundException();
      }
    }
  }

  async edit(
    hospitalId: number,
    doctorDto: AddDoctorDto,
    id: number
  ): Promise<DoctorDto & { hospitalId: number }> {
    if (Number.isNaN(hospitalId) || Number.isNaN(id)) {
      throw new HttpException(
        'hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const hospital = await this.prisma.hospital.findUnique({
      where: {
        id: hospitalId,
      },
      // select: {
      //   doctors: {
      //     where: {
      //       id: id,
      //     },
      //   },
      // },
    });
    if (!hospital) {
      throw new HttpException(
        'hospital not found check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }

    const isPhoneNumberValid = this.isValidMobileNumber(doctorDto.phoneNumber);

    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${doctorDto.phoneNumber} is a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const checkdoctor = await this.prisma.doctor.findUnique({
      where: { id: Number(id) },
    });
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        firstName: doctorDto.firstName,
        lastName: doctorDto.lastName,
        email: doctorDto.email,
        phoneNumber: doctorDto.phoneNumber,
        speciality: doctorDto.speciality,
        gender: doctorDto.gender,
        doctorCode: doctorDto.doctorCode,
        isActive: doctorDto.isActive,
      },
    });

    if (!checkdoctor) {
      throw new NotFoundException();
    } else {
      // const doctorHospital = await this.createDoctorHospital(
      //   doctorDto,
      //   id,
      //   hospitalId
      // );

      const checkhospital = await this.prisma.hospital.findFirst({
        where: { id: hospitalId },
      });
      if (!checkhospital) {
        throw new NotFoundException();
      } else {
        if (doctor && doctor.id != id) {
          throw new HttpException(
            'Doctor with same email already exists',
            HttpStatus.BAD_REQUEST
          );
        }
        const { gender, ...addDoctorDto } = doctorDto;
        const updateDoctor = await this.prisma.doctor.update({
          where: { id: Number(id) },
          data: {
            firstName: addDoctorDto.firstName,
            lastName: addDoctorDto.lastName,
            email: addDoctorDto.email,
            phoneNumber: addDoctorDto.phoneNumber,
            speciality: addDoctorDto.speciality,
            gender: doctorDto.gender,
            doctorCode: addDoctorDto.doctorCode,
          },
        });

        // if (addResidentDto.isPrimary) {
        //   // set other residents of this flat as not primary
        //   await this.prisma.residentFlat.updateMany({
        //     where: { flatId: flatId, residentId: { not: updateResident.id } },
        //     data: { isPrimary: false },
        //   });
        // }
        // await this.prisma.residentFlat.updateMany({
        //   where: { residentId: updateResident.id, flatId: flatId },
        //   data: { isPrimary: addResidentDto.isPrimary, type: type },
        // });
        return {
          id: updateDoctor.id,
          firstName: updateDoctor.firstName,
          lastName: updateDoctor.lastName,
          gender: updateDoctor.gender,
          email: updateDoctor.email,
          phoneNumber: updateDoctor.phoneNumber,
          hospitalId: hospitalId,
          speciality: updateDoctor.speciality,
          doctorCode: updateDoctor.doctorCode,
          isActive: updateDoctor.isActive,
        };
      }
    }
  }

  async getFilteredDoctors(
    pageSize: number,
    pageOffset: number,
    name: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    speciality: string,
    doctorCode: string,
    // gender:Gender,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    // doctorId: number,
    hospitalId: number,
    associateHospitalId: boolean
  ): Promise<ListDoctorPageDto> {
    if (Number.isNaN(hospitalId)) {
      throw new HttpException(
        'hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    if (associateHospitalId) {
      const hospital = await this.prisma.hospital.findUnique({
        where: {
          id: hospitalId,
        },
        select: {
          id: true,
          // doctors: {
          //   where: {
          //     id: doctorId,
          //   },
          // },
        },
      });
      if (!hospital) {
        throw new HttpException(
          'hospital not found check hospitalId',
          HttpStatus.NOT_FOUND
        );
      }

      const sort = (sortBy ? sortBy : 'name').toString();
      const order = sortOrder ? sortOrder : 'asc';
      const size = pageSize ? pageSize : 10;
      const offset = pageOffset ? pageOffset : 0;
      const orderBy = { [sort]: order };
      const count = await this.prisma.doctor.count({
        where: {
          hospitals: {
            some: {
              hospitalId: hospitalId,
            },
          },
        },
      });

      const doctors = await this.prisma.doctor.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          speciality: true,
          gender: true,
          doctorCode: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          hospitals: {
            select: {
              id: true,
              hospital: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          hospitals: {
            some: {
              hospitalId: hospitalId,
              hospital: {
            id: hospitalId,
          },
        },
      },
    
        },
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
        content: doctors,
      };
    }

    const whereArray = [];

    let whereQuery = {};

    whereArray.push({
      hospital: {
        id: hospitalId,
      },
    });

    if (name !== undefined) {
      whereArray.push({ firstName: { contains: name, mode: 'insensitive' } });
    }
    // if (lastName !== undefined) {
    //   whereArray.push({ name: { contains: lastName, mode: 'insensitive' } });
    // }
    // if (speciality !== undefined) {
    //   whereArray.push({ name: { contains: speciality, mode: 'insensitive' } });
    // }

    if (email !== undefined) {
      whereArray.push({ email: { contains: email, mode: 'insensitive' } });
    }

    if (phoneNumber !== undefined) {
      whereArray.push({
        phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
      });
    }

    if (whereArray.length > 0) {
      if (whereArray.length > 1) {
        whereQuery = { AND: whereArray };
      } else {
        whereQuery = whereArray[0];
      }
    }
    const sort = (sortBy ? sortBy : 'name').toString();
    const order = sortOrder ? sortOrder : 'asc';
    const size = pageSize ? pageSize : 10;
    const offset = pageOffset ? pageOffset : 0;
    const orderBy = { [sort]: order };
    const count = await this.prisma.doctor.count({
      where: whereQuery,
    });

    const listdoctor = await this.prisma.doctor.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        speciality: true,
        gender: true,
        doctorCode: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        hospitals: {
          select: {
            id: true,
            hospital: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: whereQuery,
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
      content: listdoctor,
    };
  }

  async deleteDoctor(hospitalId: number, id: number): Promise<void> {
    if (Number.isNaN(hospitalId) || Number.isNaN(id)) {
      throw new HttpException(
        'hospital id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const hospital = await this.prisma.hospital.findUnique({
      where: {
        id: hospitalId,
      },
      // select: {
      //   doctors: {
      //     where: {
      //       id: id,
      //     },
      //   },
      // },
    });
    if (!hospital) {
      throw new HttpException(
        'hospital not found check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }

    const doctorHospitalRelation = await this.prisma.doctorHospital.findFirst({
      where: {
        doctorId: id,
        hospitalId: hospitalId,
      },
    });
    if (doctorHospitalRelation) {
      await this.prisma.doctorHospital.delete({
        where: {
          id: doctorHospitalRelation.id,
        },
      });
    }

    const doctor = await this.prisma.doctor.delete({
      where: { id: Number(id) },
    });
    if (!doctor) {
      throw new NotFoundException();
    } else {
      return;
    }
  }

  async softDeleteDoctor(
    hospitalId: number,
    id: number,
    status: string
  ): Promise<void> {
    if (Number.isNaN(hospitalId) || Number.isNaN(id)) {
      throw new HttpException(
        'hospitalId id is missing in params',
        HttpStatus.BAD_REQUEST
      );
    }

    const hospital = await this.prisma.hospital.findUnique({
      where: {
        id: hospitalId,
      },
    });
    if (!hospital) {
      throw new HttpException('hospital not found', HttpStatus.NOT_FOUND);
    }

    const checkdoctor = await this.prisma.doctor.findUnique({
      where: { id: Number(id) },
    });
    if (!checkdoctor) {
      throw new NotFoundException();
    } else {
      const flag = status === 'true';
      if (checkdoctor.isActive != flag) {
        const dele = await this.prisma.doctor.update({
          where: { id: Number(id) },
          data: { isActive: flag },
        });
        if (!dele) {
          throw new NotFoundException();
        } else {
          return;
        }
      }
    }
  }

  async createdoctorHospital(
    addDoctorDto: AddDoctorDto,
    id: number,
    hospitalId: number
  ): Promise<DoctorHospital> {
    const doctorHospital = await this.prisma.doctorHospital.findFirst({
      where: {
        hospitalId: hospitalId,
        doctorId: Number(id),
      },
    });
    if (!doctorHospital) {
      const addDoctorData = {
        hospitalId: hospitalId,
        doctorId: Number(id),
        speciality: addDoctorDto.speciality,
      };
      const addDoctorHospital = await this.prisma.doctorHospital.create({
        data: addDoctorData,
      });
      return addDoctorHospital;
    }
    if (doctorHospital) {
      if (doctorHospital.speciality != addDoctorDto.speciality) {
        const doctorhospital = await this.prisma.doctorHospital.update({
          where: { id: doctorHospital.id },
          data: { speciality: doctorHospital.speciality },
        });
        return doctorhospital;
      }
    }
    return doctorHospital;
  }
}





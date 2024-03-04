import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorDto } from './dto/doctors.dto';
import { PrismaClient, DoctorHospital } from '@prisma/client';
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

    // TODO: implement transaction

    const hospital = await this.prisma.hospital.findUnique({
      where: {
        id: hospitalId,
      },
    });
    console.log(hospital)
    if (!hospital) {
      throw new HttpException(
        'hospital not found check hospitalId',
        HttpStatus.NOT_FOUND
      );
    }

    const isPhoneNumberValid = this.isValidMobileNumber(
      addDoctordto.phoneNumber
    );

    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${addDoctordto.phoneNumber} is a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const doctor = await this.prisma.doctor.findFirst({
      where: {
        firstName: addDoctordto.firstName,
        lastName: addDoctordto.lastName,
        speciality: addDoctordto.speciality,
        gender: addDoctordto.gender,
        email: addDoctordto.email,
        phoneNumber: addDoctordto.phoneNumber,
        isActive: addDoctordto.isActive
      }
    });
    if (doctor) {
      const doctorHospital = await this.prisma.doctorHospital.findFirst({
        where: {
          hospitalId: hospitalId,
          doctorId: doctor.id,
        },
      });
      if (doctorHospital) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Doctor already exists',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      const checkHospital = await this.prisma.hospital.findFirst({
        where: { id: hospitalId },
      });
      if (!checkHospital) {
        throw new NotFoundException();
      } else {
        // const { gender } = addDoctordto;
        const addDoctorData = {
          hospitalId: hospitalId,
          doctorId: doctor.id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          speciality: doctor.speciality,
          doctorCode: doctor.doctorCode,
          gender: doctor.gender,

        };
        const addDoctorHospital = await this.prisma.doctorHospital.create({
          data: addDoctorData,
        });
        // if (addDoctorData.isPrimary) {
        //   // set other residents of this flat as not primary
        //   await this.prisma.residentFlat.updateMany({
        //     where: { flatId: flatId, residentId: { not: resident.id } },
        //     data: { isPrimary: false },
        //   });
        // }
        return {
          id: doctor.id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          speciality: doctor.speciality,
          gender: doctor.gender,
          isActive: doctor.isActive,
        };
      }
    }

    const checkHospital = await this.prisma.hospital.findFirst({
      where: { id: hospitalId },
    });
    if (!checkHospital) {
      throw new NotFoundException();
    } else {
      const { gender, ...addDoctorDto } = addDoctordto;
      const addDoctor = await this.prisma.doctor.create({
        data: {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          doctorCode: doctor.doctorCode,
          speciality: doctor.speciality,
          gender: doctor.gender,
          isActive: addDoctorDto.isActive
        },
      });
      const addDoctorData = {
        hospitalId: hospitalId,
        doctorId: addDoctor.id,
        gender: gender,
        firstName: addDoctorDto.firstName,
        lastName: addDoctorDto.lastName,
        email: addDoctorDto.email,
        phoneNumber: addDoctorDto.phoneNumber,
        // doctorCode: addDoctorDto.doctorCode,
        speciality: addDoctorDto.speciality,
        // gender:doctor.gender,
        isActive: addDoctorDto.isActive
      };
      const addDoctorHospital = await this.prisma.doctorHospital.create({
        data: addDoctorData,
      });
      // if (addResidentData.isPrimary) {
      //   // set other residents of this flat as not primary
      //   await this.prisma.residentFlat.updateMany({
      //     where: { flatId: flatId, residentId: { not: addResident.id } },
      //     data: { isPrimary: false },
      //   });
      // }
      return {
        id: addDoctor.id,
        firstName: addDoctor.firstName,
        lastName: addDoctor.lastName,
        email: addDoctor.email,
        phoneNumber: addDoctor.phoneNumber,
        gender: addDoctor.gender,
        speciality: addDoctor.speciality,
        isActive: addDoctor.isActive,
      };
    }
  }

  //   async findById(
  //     societyId: number,
  //     buildingId: number,
  //     floorId: number,
  //     flatId: number,
  //     id: number,
  //     userId: number
  //   ): Promise<ViewResidentDto> {
  //     if (Number.isNaN(societyId) || Number.isNaN(id)) {
  //       throw new HttpException(
  //         'society id is missing in params',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const society = await this.prisma.society.findUnique({
  //       where: {
  //         id: societyId,
  //       },
  //       select: {
  //         buildings: {
  //           where: {
  //             id: buildingId,
  //           },
  //           select: {
  //             floors: {
  //               where: {
  //                 id: floorId,
  //               },
  //               select: {
  //                 flats: {
  //                   where: {
  //                     id: flatId,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //     if (society) {
  //       if (society.buildings[0] != undefined) {
  //         if (society.buildings[0].floors[0] != undefined) {
  //           if (society.buildings[0].floors[0].flats[0] != undefined) {
  //             console.log('all set');
  //           } else {
  //             throw new HttpException(
  //               'flat not found check FlatId',
  //               HttpStatus.NOT_FOUND
  //             );
  //           }
  //         } else {
  //           throw new HttpException(
  //             'floor not found check floorId',
  //             HttpStatus.NOT_FOUND
  //           );
  //         }
  //       } else {
  //         throw new HttpException(
  //           'building not found check buildingId',
  //           HttpStatus.NOT_FOUND
  //         );
  //       }
  //     } else {
  //       throw new HttpException(
  //         'society not found check societyId',
  //         HttpStatus.NOT_FOUND
  //       );
  //     }

  //     const residentview = await this.prisma.resident.findUnique({
  //       where: { id: Number(id) },
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         phoneNumber: true,
  //         isChild: true,
  //         isActive: true,
  //         flats: {
  //           select: {
  //             isPrimary: true,
  //             type: true,
  //             flat: {
  //               select: {
  //                 id: true,
  //                 number: true,
  //                 floor: {
  //                   select: {
  //                     id: true,
  //                     number: true,
  //                     building: {
  //                       select: {
  //                         id: true,
  //                         name: true,
  //                         society: {
  //                           select: {
  //                             id: true,
  //                             name: true,
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //     if (!residentview) {
  //       throw new NotFoundException();
  //     } else {
  //       if (residentview.isActive) {
  //         return residentview;
  //       } else {
  //         throw new NotFoundException();
  //       }
  //     }
  //   }

  //   async edit(
  //     societyId: number,
  //     buildingId: number,
  //     floorId: number,
  //     flatId: number,
  //     residentDto: AddResidentDto,
  //     id: number
  //   ): Promise<ResidentDto & { flatId: number }> {
  //     if (Number.isNaN(societyId) || Number.isNaN(id)) {
  //       throw new HttpException(
  //         'society id is missing in params',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const society = await this.prisma.society.findUnique({
  //       where: {
  //         id: societyId,
  //       },
  //       select: {
  //         buildings: {
  //           where: {
  //             id: buildingId,
  //           },
  //           select: {
  //             floors: {
  //               where: {
  //                 id: floorId,
  //               },
  //               select: {
  //                 flats: {
  //                   where: {
  //                     id: flatId,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //     if (society) {
  //       if (society.buildings[0] != undefined) {
  //         if (society.buildings[0].floors[0] != undefined) {
  //           if (society.buildings[0].floors[0].flats[0] != undefined) {
  //             console.log('all set');
  //           } else {
  //             throw new HttpException(
  //               'flat not found check FlatId',
  //               HttpStatus.NOT_FOUND
  //             );
  //           }
  //         } else {
  //           throw new HttpException(
  //             'floor not found check floorId',
  //             HttpStatus.NOT_FOUND
  //           );
  //         }
  //       } else {
  //         throw new HttpException(
  //           'building not found check buildingId',
  //           HttpStatus.NOT_FOUND
  //         );
  //       }
  //     } else {
  //       throw new HttpException(
  //         'society not found check societyId',
  //         HttpStatus.NOT_FOUND
  //       );
  //     }

  //     const isPhoneNumberValid = this.isValidMobileNumber(
  //       residentDto.phoneNumber
  //     );

  //     if (!isPhoneNumberValid) {
  //       throw new HttpException(
  //         `${residentDto.phoneNumber} is a valid 10-digit mobile number.`,
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const checkresident = await this.prisma.resident.findUnique({
  //       where: { id: Number(id) },
  //     });
  //     const resident = await this.prisma.resident.findFirst({
  //       where: {
  //         name: residentDto.name,
  //         email: residentDto.email,
  //         phoneNumber: residentDto.phoneNumber,
  //         isChild: residentDto.isChild,
  //         isActive: residentDto.isActive
  //       },
  //     });

  //     if (!checkresident) {
  //       throw new NotFoundException();
  //     } else {
  //       const residentFlat = await this.createResidentFlat(
  //         residentDto,
  //         id,
  //         flatId
  //       );

  //       const checkflat = await this.prisma.flat.findFirst({
  //         where: { id: flatId },
  //       });
  //       if (!checkflat) {
  //         throw new NotFoundException();
  //       } else {
  //         if (resident && resident.id != id) {
  //           throw new HttpException(
  //             'User with same email already exists',
  //             HttpStatus.BAD_REQUEST
  //           );
  //         }
  //         const { type, ...addResidentDto } = residentDto;
  //         const updateResident = await this.prisma.resident.update({
  //           where: { id: Number(id) },
  //           data: {
  //             name: addResidentDto.name,
  //             email: addResidentDto.email,
  //             phoneNumber: addResidentDto.phoneNumber,
  //             isChild: addResidentDto.isChild
  //           },
  //         });

  //         if (addResidentDto.isPrimary) {
  //           // set other residents of this flat as not primary
  //           await this.prisma.residentFlat.updateMany({
  //             where: { flatId: flatId, residentId: { not: updateResident.id } },
  //             data: { isPrimary: false },
  //           });
  //         }
  //         await this.prisma.residentFlat.updateMany({
  //           where: { residentId: updateResident.id, flatId: flatId },
  //           data: { isPrimary: addResidentDto.isPrimary, type: type },
  //         });
  //         return {
  //           id: updateResident.id,
  //           name: updateResident.name,
  //           type: residentFlat.type,
  //           email: updateResident.email,
  //           phoneNumber: updateResident.phoneNumber,
  //           isChild: updateResident.isChild,
  //           flatId: flatId,
  //           isPrimary: addResidentDto.isPrimary,
  //           isActive: updateResident.isActive,
  //         };
  //       }
  //     }
  //   }

  //   async getFilteredResidents(
  //     pageSize: number,
  //     pageOffset: number,
  //     name: string,
  //     email: string,
  //     phoneNumber: string,
  //     sortBy: string,
  //     sortOrder: 'asc' | 'desc',
  //     userId: number,
  //     societyId: number,
  //     buildingId: number,
  //     floorId: number,
  //     flatId: number,
  //     associateFlatId: boolean
  //   ): Promise<ListResidentPageDto> {
  //     if (Number.isNaN(societyId)) {
  //       throw new HttpException(
  //         'society id is missing in params',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     if (associateFlatId) {
  //       const society = await this.prisma.society.findUnique({
  //         where: {
  //           id: societyId,
  //         },
  //         select: {
  //           buildings: {
  //             where: {
  //               id: buildingId,
  //             },
  //             select: {
  //               floors: {
  //                 where: {
  //                   id: floorId,
  //                 },
  //                 select: {
  //                   flats: {
  //                     where: {
  //                       id: flatId,
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       });
  //       if (society) {
  //         if (society.buildings[0] != undefined) {
  //           if (society.buildings[0].floors[0] != undefined) {
  //             if (society.buildings[0].floors[0].flats[0] != undefined) {
  //               console.log('all set');
  //             } else {
  //               throw new HttpException(
  //                 'flat not found check FlatId',
  //                 HttpStatus.NOT_FOUND
  //               );
  //             }
  //           } else {
  //             throw new HttpException(
  //               'floor not found check floorId',
  //               HttpStatus.NOT_FOUND
  //             );
  //           }
  //         } else {
  //           throw new HttpException(
  //             'building not found check buildingId',
  //             HttpStatus.NOT_FOUND
  //           );
  //         }
  //       } else {
  //         throw new HttpException(
  //           'society not found check societyId',
  //           HttpStatus.NOT_FOUND
  //         );
  //       }

  //       const sort = (sortBy ? sortBy : 'name').toString();
  //       const order = sortOrder ? sortOrder : 'asc';
  //       const size = pageSize ? pageSize : 10;
  //       const offset = pageOffset ? pageOffset : 0;
  //       const orderBy = { [sort]: order };
  //       const count = await this.prisma.resident.count({
  //         where: {
  //           flats: {
  //             some: {
  //               flatId: flatId,
  //             },
  //           },
  //         },
  //       });

  //       const residents = await this.prisma.resident.findMany({
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           phoneNumber: true,
  //           isChild: true,
  //           isActive: true,
  //           createdAt: true,
  //           updatedAt: true,
  //           flats: {
  //             select: {
  //               isPrimary: true,
  //               type: true,
  //               flat: {
  //                 select: {
  //                   id: true,
  //                   number: true,
  //                   floor: {
  //                     select: {
  //                       id: true,
  //                       number: true,
  //                       building: {
  //                         select: {
  //                           id: true,
  //                           name: true,
  //                           society: {
  //                             select: {
  //                               id: true,
  //                               name: true,
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         where: {
  //           flats: {
  //             some: {
  //               flatId: flatId,
  //               flat: {
  //                 floor: {
  //                   id: floorId,
  //                   building: {
  //                     id: buildingId,
  //                     society: {
  //                       id: societyId,
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       });

  //       return {
  //         size: size,
  //         number: offset,
  //         total: count,
  //         sort: [
  //           {
  //             by: sort,
  //             order: order,
  //           },
  //         ],
  //         content: residents,
  //       };
  //     }

  //     const whereArray = [];

  //     let whereQuery = {};

  //     whereArray.push({
  //       flats: {
  //         some: {
  //           flat: {
  //             floor: {
  //               building: {
  //                 society: {
  //                   id: societyId,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     if (name !== undefined) {
  //       whereArray.push({ name: { contains: name, mode: 'insensitive' } });
  //     }

  //     if (email !== undefined) {
  //       whereArray.push({ email: { contains: email, mode: 'insensitive' } });
  //     }

  //     if (phoneNumber !== undefined) {
  //       whereArray.push({
  //         phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
  //       });
  //     }

  //     if (whereArray.length > 0) {
  //       if (whereArray.length > 1) {
  //         whereQuery = { AND: whereArray };
  //       } else {
  //         whereQuery = whereArray[0];
  //       }
  //     }
  //     const sort = (sortBy ? sortBy : 'name').toString();
  //     const order = sortOrder ? sortOrder : 'asc';
  //     const size = pageSize ? pageSize : 10;
  //     const offset = pageOffset ? pageOffset : 0;
  //     const orderBy = { [sort]: order };
  //     const count = await this.prisma.resident.count({
  //       where: whereQuery,
  //     });

  //     const listresident = await this.prisma.resident.findMany({
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         phoneNumber: true,
  //         isChild: true,
  //         isActive: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         flats: {
  //           select: {
  //             isPrimary: true,
  //             type: true,
  //             flat: {
  //               select: {
  //                 id: true,
  //                 number: true,
  //                 floor: {
  //                   select: {
  //                     id: true,
  //                     number: true,
  //                     building: {
  //                       select: {
  //                         id: true,
  //                         name: true,
  //                         society: {
  //                           select: {
  //                             id: true,
  //                             name: true,
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       where: whereQuery,
  //       take: Number(size),
  //       skip: Number(size * offset),
  //       orderBy,
  //     });

  //     return {
  //       size: size,
  //       number: offset,
  //       total: count,
  //       sort: [
  //         {
  //           by: sort,
  //           order: order,
  //         },
  //       ],
  //       content: listresident,
  //     };
  //   }

  //   async deleteResident(
  //     societyId: number,
  //     buildingId: number,
  //     floorId: number,
  //     flatId: number,
  //     id: number
  //   ): Promise<void> {
  //     if (Number.isNaN(societyId) || Number.isNaN(id)) {
  //       throw new HttpException(
  //         'society id is missing in params',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const society = await this.prisma.society.findUnique({
  //       where: {
  //         id: societyId,
  //       },
  //       select: {
  //         buildings: {
  //           where: {
  //             id: buildingId,
  //           },
  //           select: {
  //             floors: {
  //               where: {
  //                 id: floorId,
  //               },
  //               select: {
  //                 flats: {
  //                   where: {
  //                     id: flatId,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //     if (society) {
  //       if (society.buildings[0] != undefined) {
  //         if (society.buildings[0].floors[0] != undefined) {
  //           if (society.buildings[0].floors[0].flats[0] != undefined) {
  //             console.log('all set');
  //           } else {
  //             throw new HttpException(
  //               'flat not found check FlatId',
  //               HttpStatus.NOT_FOUND
  //             );
  //           }
  //         } else {
  //           throw new HttpException(
  //             'floor not found check floorId',
  //             HttpStatus.NOT_FOUND
  //           );
  //         }
  //       } else {
  //         throw new HttpException(
  //           'building not found check buildingId',
  //           HttpStatus.NOT_FOUND
  //         );
  //       }
  //     } else {
  //       throw new HttpException(
  //         'society not found check societyId',
  //         HttpStatus.NOT_FOUND
  //       );
  //     }

  //     const residentFlatRelation = await this.prisma.residentFlat.findFirst({
  //       where: {
  //         residentId: id,
  //         flatId: flatId,
  //       },
  //     });
  //     if (residentFlatRelation) {
  //       await this.prisma.residentFlat.delete({
  //         where: {
  //           id: residentFlatRelation.id,
  //         },
  //       });
  //     }

  //     const resident = await this.prisma.resident.delete({
  //       where: { id: Number(id) },
  //     });
  //     if (!resident) {
  //       throw new NotFoundException();
  //     } else {
  //       return;
  //     }
  //   }

  //   async softDeleteResident(
  //     societyId: number,
  //     id: number,
  //     status: string
  //   ): Promise<void> {
  //     if (Number.isNaN(societyId) || Number.isNaN(id)) {
  //       throw new HttpException(
  //         'society id is missing in params',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const society = await this.prisma.society.findUnique({
  //       where: {
  //         id: societyId,
  //       },
  //     });
  //     if (!society) {
  //       throw new HttpException('society not found', HttpStatus.NOT_FOUND);
  //     }

  //     const checkresident = await this.prisma.resident.findUnique({
  //       where: { id: Number(id) },
  //     });
  //     if (!checkresident) {
  //       throw new NotFoundException();
  //     } else {
  //       const flag = status === 'true';
  //       if (checkresident.isActive != flag) {
  //         const dele = await this.prisma.resident.update({
  //           where: { id: Number(id) },
  //           data: { isActive: flag },
  //         });
  //         if (!dele) {
  //           throw new NotFoundException();
  //         } else {
  //           return;
  //         }
  //       }
  //     }
  //   }

  //   async createResidentFlat(
  //     addResidentDto: AddResidentDto,
  //     id: number,
  //     flatId: number
  //   ): Promise<ResidentFlat> {
  //     const residentFlat = await this.prisma.residentFlat.findFirst({
  //       where: {
  //         flatId: flatId,
  //         residentId: Number(id),
  //       },
  //     });
  //     if (!residentFlat) {
  //       const addResidentData = {
  //         flatId: flatId,
  //         residentId: Number(id),
  //         type: addResidentDto.type,
  //       };
  //       const addResidentFlat = await this.prisma.residentFlat.create({
  //         data: addResidentData,
  //       });
  //       return addResidentFlat;
  //     }
  //     if (residentFlat) {
  //       if (residentFlat.type != addResidentDto.type) {
  //         const residentflat = await this.prisma.residentFlat.update({
  //           where: { id: residentFlat.id },
  //           data: { type: addResidentDto.type },
  //         });
  //         return residentflat;
  //       }
  //     }
  //     return residentFlat;
  //   }
}

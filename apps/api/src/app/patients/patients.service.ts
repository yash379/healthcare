import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PatientDto } from './dto/patient.dto';
import { PrismaClient, PatientHospital, Gender } from '@prisma/client';
import { AddPatientDto } from './dto/add-patient.dto';
import { ViewPatientDto } from './dto/view-patient.dto';
import { ListPatientPageDto } from './dto/list-patient-page.dto';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';

@Injectable()
export class PatientsService {
  private prisma = new PrismaClient();

  // async exportPatientsDetailsForHospital(hospitalId: number) {
  //   const hospital = await this.prisma.hospital.findFirst({
  //     where: {
  //       id: hospitalId
  //     }
  //   })

  //   if (!hospital) throw new HttpException("hospital not found", HttpStatus.NOT_FOUND);

  //   // generate patient data for the hospital where the patient is associated for the hospital
  //   const patients = await this.prisma.patient.findMany({
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
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
  //   addPatientdto: AddPatientDto
  // ): Promise<PatientDto> {
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
  //     addPatientdto.phoneNumber
  //   );

  //   if (!isPhoneNumberValid) {
  //     throw new HttpException(
  //       `${addPatientdto.phoneNumber} is a valid 10-digit mobile number.`,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  //   const patient = await this.prisma.patient.findFirst({
  //     where: {
  //       firstName: addPatientdto.firstName,
  //       lastName: addPatientdto.lastName,
  //       email: addPatientdto.email,
  //       phoneNumber: addPatientdto.phoneNumber,
  //       gender: addPatientdto.gender,
  //       bloodgroup: addPatientdto.bloodgroup,
  //       dob: addPatientdto.dob,
  //       digitalHealthCode: addPatientdto.digitalHealthCode,
  //       addressLine1: addPatientdto.addressLine1,
  //       addressLine2: addPatientdto.addressLine2,
  //       city: addPatientdto.city,
  //       stateCode: addPatientdto.stateCode,
  //       countryCode: addPatientdto.countryCode,
  //       postalCode: addPatientdto.postalCode,
  //       isActive: addPatientdto.isActive,
  //     },
  //   });
  //   if (patient) {
  //     const patientHospital = await this.prisma.patientHospital.findFirst({
  //       where: {
  //         hospitalId: hospitalId,
  //         patientId: patient.id,
  //       },
  //     });
  //     if (patientHospital) {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.BAD_REQUEST,
  //           error: 'Patient already exists',
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
  //       const { gender } = addPatientdto;
  //       const addPatientData = {
  //         hospitalId: hospitalId,
  //         patientId: patient.id,
  //         digitalHealthCode:patient.digitalHealthCode,
  //         // firstName: patient.firstName,
  //         // lastName: patient.lastName,
  //         // email: patient.email,
  //         // phoneNumber: patient.phoneNumber,
  //         // gender: patient.gender,
  //       };
  //       console.log(addPatientData);
  //       const addPatientHospital = await this.prisma.patientHospital.create({
  //         data: addPatientData,
  //       });
  //       // if (addPatientData.isPrimary) {
  //       //   // set other residents of this flat as not primary
  //       //   await this.prisma.residentFlat.updateMany({
  //       //     where: { flatId: flatId, residentId: { not: resident.id } },
  //       //     data: { isPrimary: false },
  //       //   });
  //       // }
  //       return {
  //         id: patient.id,
  //         firstName: patient.firstName,
  //         lastName: patient.lastName,
  //         email: patient.email,
  //         phoneNumber: patient.phoneNumber,
  //         gender: patient.gender,
  //         bloodgroup: patient.bloodgroup,
  //         dob: patient.dob,
  //         digitalHealthCode: patient.digitalHealthCode,
  //         addressLine1: patient.addressLine1,
  //         addressLine2: patient.addressLine2,
  //         city: patient.city,
  //         stateCode: patient.stateCode,
  //         countryCode: patient.countryCode,
  //         postalCode: patient.postalCode,

  //         // hospitalId:addPatientHospital.hospitalId,
  //         isActive: patient.isActive,
  //       };
  //     }
  //   }

  //   const checkHospital = await this.prisma.hospital.findFirst({
  //     where: { id: hospitalId },
  //   });
  //   if (!checkHospital) {
  //     throw new NotFoundException();
  //   } else {
  //     const { gender, ...addPatientDto } = addPatientdto;
  //     const addPatient = await this.prisma.patient.create({
  //       data: {
  //         firstName: addPatientDto.firstName,
  //         lastName: addPatientDto.lastName,
  //         email: addPatientDto.email,
  //         phoneNumber: addPatientDto.phoneNumber,
  //         gender: gender,
  //         bloodgroup: addPatientDto.bloodgroup,
  //         dob: addPatientDto.dob,
  //         digitalHealthCode: addPatientDto.digitalHealthCode,
  //         addressLine1: addPatientDto.addressLine1,
  //         addressLine2: addPatientDto.addressLine2,
  //         city: addPatientDto.city,
  //         stateCode: addPatientDto.stateCode,
  //         countryCode: addPatientDto.countryCode,
  //         postalCode: addPatientDto.postalCode,

  //         isActive: addPatientDto.isActive,
  //         hospitals: {
  //           create: [
  //             {
  //               hospitalId: hospitalId,
  //               digitalHealthCode: addPatientDto.digitalHealthCode,
  //             },
  //           ],
  //         },
  //       },
  //     });
  //     const addPatientData = {
  //       hospitalId: hospitalId,
  //       patientId: addPatient.id,
  //       digitalHealthCode:addPatient.digitalHealthCode,
  //       // gender: gender,
  //       // firstName: addPatientDto.firstName,
  //       // lastName: addPatientDto.lastName,
  //       // email: addPatientDto.email,
  //       // phoneNumber: addPatientDto.phoneNumber,
  //       // gender:gender,
  //       // isActive: addPatientDto.isActive
  //     };
  //     const addPatientHospital = await this.prisma.patientHospital.create({
  //       data: addPatientData,
  //     });
  //     // if (addResidentData.isPrimary) {
  //     //   // set other residents of this flat as not primary
  //     //   await this.prisma.residentFlat.updateMany({
  //     //     where: { flatId: flatId, residentId: { not: addResident.id } },
  //     //     data: { isPrimary: false },
  //     //   });
  //     // }
  //     return {
  //       id: addPatient.id,
  //       firstName: addPatient.firstName,
  //       lastName: addPatient.lastName,
  //       email: addPatient.email,
  //       phoneNumber: addPatient.phoneNumber,
  //       gender: addPatient.gender,
  //       bloodgroup: addPatient.bloodgroup,
  //       dob: addPatient.dob,
  //       digitalHealthCode: addPatient.digitalHealthCode,
  //       addressLine1: addPatient.addressLine1,
  //       addressLine2: addPatient.addressLine2,
  //       city: addPatient.city,
  //       stateCode: addPatient.stateCode,
  //       countryCode: addPatient.countryCode,
  //       postalCode: addPatient.postalCode,
  //       isActive: addPatient.isActive,
  //     };
  //   }
  // }

 
  async add(
    hospitalId: number,
    addPatientdto: AddPatientDto
  ): Promise<PatientDto> {
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
      addPatientdto.phoneNumber
    );
    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${addPatientdto.phoneNumber} is not a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }
  
    // Check if Patient already exists
    let patient = await this.prisma.patient.findFirst({
      where: {
        firstName: addPatientdto.firstName,
        lastName: addPatientdto.lastName,
        email: addPatientdto.email,
        phoneNumber: addPatientdto.phoneNumber,
        gender: addPatientdto.gender,
        bloodgroup: addPatientdto.bloodgroup,
        dob: addPatientdto.dob,
        digitalHealthCode: addPatientdto.digitalHealthCode,
        addressLine1: addPatientdto.addressLine1,
        addressLine2: addPatientdto.addressLine2,
        city: addPatientdto.city,
        stateCode: addPatientdto.stateCode,
        countryCode: addPatientdto.countryCode,
        postalCode: addPatientdto.postalCode,
        isActive: addPatientdto.isActive,
      },
    });
  
    // If patient doesn't exist, create a new one
    if (!patient) {
      patient = await this.prisma.patient.create({
        data: {
          firstName: addPatientdto.firstName,
          lastName: addPatientdto.lastName,
          email: addPatientdto.email,
          phoneNumber: addPatientdto.phoneNumber,
          gender: addPatientdto.gender,
          bloodgroup: addPatientdto.bloodgroup,
          dob: addPatientdto.dob,
          digitalHealthCode: addPatientdto.digitalHealthCode,
          addressLine1: addPatientdto.addressLine1,
          addressLine2: addPatientdto.addressLine2,
          city: addPatientdto.city,
          stateCode: addPatientdto.stateCode,
          countryCode: addPatientdto.countryCode,
          postalCode: addPatientdto.postalCode,
          isActive: addPatientdto.isActive,
        },
      });
    }
  
    // Check if patientHospital entry already exists
    const existingPatientHospital = await this.prisma.patientHospital.findFirst({
      where: {
        hospitalId: hospitalId,
        patientId: patient.id,
      },
    });
  
    // If patientHospital entry already exists, throw an error
    if (existingPatientHospital) {
      throw new HttpException(
        'Patient is already associated with this hospital',
        HttpStatus.BAD_REQUEST
      );
    }
  
    // Create patientHospital entry
    const addPatientHospital = await this.prisma.patientHospital.create({
      data: {
        hospitalId: hospitalId,
        patientId: patient.id,
        digitalHealthCode: patient.digitalHealthCode,
      },
    });
  
    // Return patient details
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      gender: patient.gender,
      bloodgroup: patient.bloodgroup,
      dob: patient.dob,
      digitalHealthCode: patient.digitalHealthCode,
      addressLine1: patient.addressLine1,
      addressLine2: patient.addressLine2,
      city: patient.city,
      stateCode: patient.stateCode,
      countryCode: patient.countryCode,
      postalCode: patient.postalCode,
      isActive: patient.isActive,
    };
  }

  async findByIdForSwitch(id: number): Promise<PatientDto> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        gender: true,
        bloodgroup: true,
        dob: true,
        digitalHealthCode: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
        isActive: true,
      },
    });
    console.log(patient);
    if (!patient) {
      throw new NotFoundException();
    }
    if (!patient.isActive)
      throw new HttpException('patient is inactive', HttpStatus.BAD_REQUEST);

    const viewPatient = {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      gender: patient.gender,
      bloodgroup: patient.bloodgroup,
      dob: patient.dob,
      digitalHealthCode: patient.digitalHealthCode,
      addressLine1: patient.addressLine1,
      addressLine2: patient.addressLine2,
      city: patient.city,
      stateCode: patient.stateCode,
      countryCode: patient.countryCode,
      postalCode: patient.postalCode,
      isActive: patient.isActive,
    };
    return viewPatient;
  }

  async findByEmail(email: string) {
    console.log(email);
    const user = await this.prisma.patient.findFirst({
      where: { email },
      select: { id: true, email: true, firstName: true },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findById(
    hospitalId: number,
    id: number
    // userId: number
  ): Promise<ViewPatientDto> {
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
        patients: {
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

    const patientview = await this.prisma.patient.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        gender: true,
        bloodgroup: true,
        dob: true,
        digitalHealthCode:true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        stateCode:true,
        countryCode: true,
        postalCode: true,
        isActive: true,
      },
    });
    if (!patientview) {
      throw new NotFoundException();
    } else {
      if (patientview.isActive) {
        return patientview;
      } else {
        throw new NotFoundException();
      }
    }
  }

  async edit(
    hospitalId: number,
    patientDto: AddPatientDto,
    id: number
  ): Promise<PatientDto & { hospitalId: number }> {
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
      //   patients: {
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

    const isPhoneNumberValid = this.isValidMobileNumber(patientDto.phoneNumber);

    if (!isPhoneNumberValid) {
      throw new HttpException(
        `${patientDto.phoneNumber} is a valid 10-digit mobile number.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const checkpatient = await this.prisma.patient.findUnique({
      where: { id: Number(id) },
    });
    const patient = await this.prisma.patient.findFirst({
      where: {
        firstName: patientDto.firstName,
        lastName: patientDto.lastName,
        email: patientDto.email,
        phoneNumber: patientDto.phoneNumber,
        gender: patientDto.gender,
        bloodgroup: patientDto.bloodgroup,
        dob: patientDto.dob,
        digitalHealthCode: patientDto.digitalHealthCode,
        addressLine1: patientDto.addressLine1,
        addressLine2: patientDto.addressLine2,
        city: patientDto.city,
        stateCode: patientDto.stateCode,
        countryCode: patientDto.countryCode,
        postalCode: patientDto.postalCode,
        isActive: patientDto.isActive,
      },
    });

    if (!checkpatient) {
      throw new NotFoundException();
    } else {
      // const patientHospital = await this.createPatientHospital(
      //   patientDto,
      //   id,
      //   hospitalId
      // );

      const checkhospital = await this.prisma.hospital.findFirst({
        where: { id: hospitalId },
      });
      if (!checkhospital) {
        throw new NotFoundException();
      } else {
        if (patient && patient.id != id) {
          throw new HttpException(
            'Patient with same email already exists',
            HttpStatus.BAD_REQUEST
          );
        }
        const { gender, ...addPatientDto } = patientDto;
        const updatePatient = await this.prisma.patient.update({
          where: { id: Number(id) },
          data: {
            firstName: addPatientDto.firstName,
            lastName: addPatientDto.lastName,
            email: addPatientDto.email,
            phoneNumber: addPatientDto.phoneNumber,
            gender: patientDto.gender,
            bloodgroup:addPatientDto.bloodgroup,
            dob:addPatientDto.dob,
            digitalHealthCode:addPatientDto.digitalHealthCode,
            addressLine1:addPatientDto.addressLine1,
            addressLine2:addPatientDto.addressLine2,
            city:addPatientDto.city,
            stateCode:addPatientDto.stateCode,
            countryCode:addPatientDto.countryCode,
            postalCode:addPatientDto.postalCode,
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
          id: updatePatient.id,
          firstName: updatePatient.firstName,
          lastName: updatePatient.lastName,
          gender: updatePatient.gender,
          email: updatePatient.email,
          phoneNumber: updatePatient.phoneNumber,
          bloodgroup: updatePatient.bloodgroup,
          dob: updatePatient.dob,
          digitalHealthCode: updatePatient.digitalHealthCode,
          addressLine1: updatePatient.addressLine1,
          addressLine2: updatePatient.addressLine2,
          city: updatePatient.city,
          stateCode: updatePatient.stateCode,
          countryCode: updatePatient.countryCode,
          postalCode: updatePatient.postalCode,
          hospitalId: hospitalId,
          isActive: updatePatient.isActive,
        };
      }
    }
  }

  async getFilteredPatients(
    pageSize: number,
    pageOffset: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    digitalHeathCode: string,
    // gender:Gender,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    // patientId: number,
    hospitalId: number,
    associateHospitalId: boolean
  ): Promise<ListPatientPageDto> {
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
          // patients: {
          //   where: {
          //     id: patientId,
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
      const count = await this.prisma.patient.count({
        where: {
          hospitals: {
            some: {
              hospitalId: hospitalId,
            },
          },
        },
      });

      const patients = await this.prisma.patient.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          gender: true,
          bloodgroup: true,
          dob: true,
          digitalHealthCode: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          stateCode: true,
          countryCode: true,
          postalCode: true,
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
        content: patients,
      };
    }

    const whereArray = [];

    let whereQuery = {};

    whereArray.push({
      hospital: {
        id: hospitalId,
      },
    });

    if (firstName !== undefined) {
      whereArray.push({ name: { contains: firstName, mode: 'insensitive' } });
    }
    if (lastName !== undefined) {
      whereArray.push({ name: { contains: lastName, mode: 'insensitive' } });
    }
    if (digitalHeathCode !== undefined) {
      whereArray.push({ name: { contains: digitalHeathCode, mode: 'insensitive' } });
    }

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
    const count = await this.prisma.patient.count({
      where: whereQuery,
    });

    const listpatient = await this.prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        gender: true,
        bloodgroup: true,
        dob: true,
        digitalHealthCode: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
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
      content: listpatient,
    };
  }

  async deletePatient(hospitalId: number, id: number): Promise<void> {
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
      //   patients: {
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

    const patientHospitalRelation = await this.prisma.patientHospital.findFirst({
      where: {
        patientId: id,
        hospitalId: hospitalId,
      },
    });
    if (patientHospitalRelation) {
      await this.prisma.patientHospital.delete({
        where: {
          id: patientHospitalRelation.id,
        },
      });
    }

    const patient = await this.prisma.patient.delete({
      where: { id: Number(id) },
    });
    if (!patient) {
      throw new NotFoundException();
    } else {
      return;
    }
  }

  async softDeletePatient(
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

    const checkpatient = await this.prisma.patient.findUnique({
      where: { id: Number(id) },
    });
    if (!checkpatient) {
      throw new NotFoundException();
    } else {
      const flag = status === 'true';
      if (checkpatient.isActive != flag) {
        const dele = await this.prisma.patient.update({
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

  async createpatientHospital(
    addPatientDto: AddPatientDto,
    id: number,
    hospitalId: number
  ): Promise<PatientHospital> {
    const patientHospital = await this.prisma.patientHospital.findFirst({
      where: {
        hospitalId: hospitalId,
        patientId: Number(id),
      },
    });
    if (!patientHospital) {
      const addPatientData = {
        hospitalId: hospitalId,
        patientId: Number(id),
        digitalHealthCode:addPatientDto.digitalHealthCode
      };
      const addPatientHospital = await this.prisma.patientHospital.create({
        data: addPatientData,
      });
      return addPatientHospital;
    }
    if (patientHospital) {
      if (patientHospital.digitalHealthCode != addPatientDto.digitalHealthCode) {
        const patienthospital = await this.prisma.patientHospital.update({
          where: { id: patientHospital.id },
          data: { digitalHealthCode: patientHospital.digitalHealthCode },
        });
        return patienthospital;
      }
    }
    return patientHospital;
  }
}

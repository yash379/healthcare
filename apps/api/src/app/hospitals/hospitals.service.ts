import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HospitalDto } from './dto/hospital.dto';
import { ListHospitalPageDto } from './dto/list-hospital-page.dto';
import { AddHospitalDto, AddHospitalResponseDto } from './dto/add-hospital.dto';
import { ListHospitalDto } from './dto/list-hospital.dto';
import { EditHospitalDto, EditHospitalStatusDto } from './dto/edit-hospital.dto';


import * as fs from 'fs';
import * as xlsx from 'xlsx';
import { FileDto } from '../core/dto/page-base.dto';


@Injectable()
export class HospitalsService {
  private prisma = new PrismaClient();

  async bulkUploadHospitalData(fileDto:FileDto,file){
    const workbook = xlsx.read(file.buffer);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];

    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const finalJsonData: AddHospitalDto[]= [];
    jsonData.map(hospital =>{
      const tempData : AddHospitalDto = {
        'name' : hospital['Name'],
        'addressLine1' : hospital['Address Line 1'],
        'addressLine2' : hospital['Address Line 2'],
        'city' : hospital['City'],
        'postalCode' : hospital['Postal Code'],
        'countryCode' : hospital['Country Code'],
        'stateCode' : hospital['State Code'],
        'email' : hospital['Email'],
        'phoneNumber' : String(hospital['Phone Number']),
        'code' : hospital['Code'],
        'isActive' : true,
      };
     
      
      console.log(tempData);

      finalJsonData.push(tempData);
    })

     return this.prisma.$transaction(async (tx) => {
        const result =  await tx.hospital.createMany({data:finalJsonData});
        return result;
      })

  }
  
  isValidMobileNumber(mobileNumber: string): boolean {
    // Define a regex pattern for a 10-digit mobile number
    const pattern = /^[0-9]{10}$/;
  
    // Test the provided mobile number against the pattern
    return pattern.test(mobileNumber);
  }

  


  async add(addHospitalDto: AddHospitalDto): Promise<AddHospitalResponseDto> {

    const isPhoneNumberValid = this.isValidMobileNumber(addHospitalDto.phoneNumber);

    if (!isPhoneNumberValid) {
      throw new HttpException(`${addHospitalDto.phoneNumber} is a valid 10-digit mobile number.`,HttpStatus.BAD_REQUEST);
    } 

    const checkHospital = await this.prisma.hospital.findFirst({
      where: {
        name: addHospitalDto.name,
      },
    });
    if (checkHospital) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Hospital already exists',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const addhos = await this.prisma.hospital.create({
      data: {
        name: addHospitalDto.name,
        email: addHospitalDto.email,
        phoneNumber:addHospitalDto.phoneNumber,
        addressLine1: addHospitalDto.addressLine1,
        addressLine2: addHospitalDto.addressLine2,
        city: addHospitalDto.city,
        stateCode: addHospitalDto.stateCode,
        countryCode: addHospitalDto.countryCode,
        postalCode: addHospitalDto.postalCode,
        isActive: true,
        code: addHospitalDto.code
      },
      select:{
        id: true,
        name: true,
        addressLine1: true,
        addressLine2: true,
        email: true,
        phoneNumber: true,
        city: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
        isActive: true,
        code: true
      }
    });
    return addhos;
  }

  // async giveAssetCount(hospitalId: number){
  //   if(Number.isNaN(hospitalId)) throw new HttpException('hospital id is missing in params', HttpStatus.BAD_REQUEST);

  //   const hospital = this.prisma.hospital.findUnique({
  //     where: {
  //       id: hospitalId,
  //     },
  //   });

  //   if (!hospital)
  //     throw new HttpException('hospital not found ', HttpStatus.NOT_FOUND);

  //   const hospitalIdList = await this.prisma.hospital.findFirst({
  //     select:{
  //       id: true,
  //       buildings:{
  //         select: {
  //           id: true,
  //           floors: {
  //             select: {
  //               id: true,
  //               flats: {
  //                 select: {
  //                   id: true,
  //                   residents: {
  //                     select: {
  //                       id: true,
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       }
  //     },
  //     where: {
  //       id: hospitalId
  //     }
  //   });
   

  //   const listhospital = await this.prisma.hospital.findFirst({
  //     select: {
  //       id: true,
  //       name: true,
  //       isActive: true,
  //     },
  //     where: {
  //       id: hospitalId,
  //       isActive: true
  //     }
  //   });

    


  //   async function getNestedLengths(PrismaClient,data, depth, Buildings, Floors, Flats, Residents,Vehicles) { 
      
  //     if (depth === 3) Buildings += data.length;
  //     else if (depth === 2) Floors += data.length;
  //     else if (depth === 1) Flats += data.length;
  //     else if (depth === 0) Residents += data.length;
  
  //     if (depth <= 0) {
  //         return { Buildings, Floors, Flats, Residents,Vehicles };
  //     }
  
  //     // Recursively print lengths of nested arrays
  //     for (const item of data) {
  //         if (typeof item === 'object') {
  //             let innerData;
  //             if (depth === 3) innerData = item.floors;
  //             else if (depth === 2) innerData = item.flats;
  //             else if (depth === 1) {
  //               const vehicleResponse = await PrismaClient.vehicleFlat.count({
  //                 where: {
  //                   flatId: item.id
  //                 }

  //               })
  //               if(vehicleResponse) Vehicles =vehicleResponse;
  //               innerData = item.residents;
  //             }
  
  //             const lengths = await getNestedLengths(PrismaClient,innerData, depth - 1, Buildings, Floors, Flats, Residents,Vehicles);
  //             Buildings = lengths.Buildings;
  //             Floors = lengths.Floors;
  //             Flats = lengths.Flats;
  //             Residents = lengths.Residents;
  //             Vehicles = lengths.Vehicles;
  //         }
  //     }
  
  //     return { Buildings, Floors, Flats, Residents ,Vehicles};
  // }
  
 
  //   const tempresult = await getNestedLengths(this.prisma,hospitalIdList.buildings,3, 0, 0, 0, 0,0)
  //   listhospital['assetcount'] = tempresult;
    
  //   return listhospital
  // }

 

  async findById(id: number): Promise<ListHospitalDto> {
    const hosview = await this.prisma.hospital.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        email: true,
        phoneNumber: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
        isActive: true,
        code: true
      }
    });
    if (!hosview.isActive) {
      throw new NotFoundException('Hospital not found');
    } else {
      if (!hosview) {
        throw new NotFoundException();
      }
      return hosview;
    }
  }

  async edit(hospitalDto: EditHospitalDto, id: number): Promise<HospitalDto> {
    const isPhoneNumberValid = this.isValidMobileNumber(hospitalDto.phoneNumber);

    if (!isPhoneNumberValid) {
      throw new HttpException(`${hospitalDto.phoneNumber} is a valid 10-digit mobile number.`,HttpStatus.BAD_REQUEST);
    } 

    const checkHospital = await this.prisma.hospital.findUnique({
      where: { id: Number(id) },
    });
    if (!checkHospital) {
      throw new NotFoundException();
    } else {
      const hos = await this.prisma.hospital.findFirst({
        where: {
          name: hospitalDto.name,
        },
      });

      if (hos && hos.id != id) {
        throw new HttpException(
          'Hospital with same email already exists',
          HttpStatus.BAD_REQUEST
        );
      } else {
        const updatehos = this.prisma.hospital.update({
          where: { id: id },
          data: hospitalDto,
          select:{
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            stateCode: true,
            countryCode: true,
            postalCode: true,
            isActive: true,
            code: true
          }
        });
        return updatehos;
      }
    }
  }

  async softDeleteHospital(id: number, editHospitalStatusDto: EditHospitalStatusDto): Promise<EditHospitalStatusDto> {
    const checkHospitalDele = await this.prisma.hospital.findUnique({
      where: { id: Number(id) },
    });
    if (!checkHospitalDele) {
      throw new NotFoundException('Hospital not found');
    } else {
      const flag = editHospitalStatusDto.isActive == true;
      if (checkHospitalDele.isActive != flag) {
        const dele = await this.prisma.hospital.update({
          where: { id: Number(id) },
          data: { isActive: flag },
          select: {
            isActive: true
          }
        });
        return dele;
      }
    }
  }
  async deleteHospital(id: number): Promise<void> {
    const dele = await this.prisma.hospital.findUnique({
      where: { id: Number(id) },
    });
    if (!dele) {
      throw new NotFoundException('Hospital not found');
    }

    await this.prisma.hospital.delete({
      where: { id: Number(id) },
    });
  }

  async getHospitalCounts() {
    const totalHospitalsCount = await this.prisma.hospital.count();
  
    const activeHospitalsCount = await this.prisma.hospital.count({
      where: {
        isActive: true,
      },
    });
  
    const inactiveHospitalsCount = await this.prisma.hospital.count({
      where: {
        isActive: false,
      },
    });
  
    return {
      totalHospitalsCount,
      activeHospitalsCount,
      inactiveHospitalsCount,
    };
  }
  
  
  async getFilteredHospitals(
    pageSize: number,
    pageOffset: number,
    name: string,
    city: string,
    status: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ListHospitalPageDto> {
    const whereArray = [];
    let whereQuery = {};

    if (name !== undefined) {
      whereArray.push({ name: { contains: name, mode: 'insensitive' } });
    }
    if (city !== undefined) {
      whereArray.push({ city: { contains: city, mode: 'insensitive' } });
    }
    if (status !== undefined) {
      if(status=='active'){
        whereArray.push({ isActive: true });

      }else if(status=='inactive'){
        whereArray.push({ isActive: false });

      }else if(status=='all'){
        whereArray.push({ isActive: true });
        whereArray.push({ isActive: false });

      }else{
        throw new HttpException("status should be one of 'active', 'inactive', 'all'. ",HttpStatus.BAD_REQUEST);
      }
      
    }
   
    

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
    const count = await this.prisma.hospital.count({
      where: whereQuery,
    });

    const hospitals = await this.prisma.hospital.findMany({
      select: {
        id: true,
        name: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        email: true,
        phoneNumber: true,
        stateCode: true,
        countryCode: true,
        postalCode: true,
        isActive: true,
        code: true,
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
      content: hospitals,
    };
  }
}

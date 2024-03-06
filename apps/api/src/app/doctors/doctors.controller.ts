import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  Request,
  Post,
  Get,
  Put,
  Body,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListDoctorPageDto } from './dto/list-doctor-page.dto';
import { DoctorDto } from './dto/doctors.dto';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { ViewDoctorDto } from './dto/view-doctor.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';
import { Gender } from '@prisma/client';

@ApiTags('doctors')
@Controller()
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  // @Get('/hospitals/:hospitalId/doctors')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: ListDoctorPageDto })
  // async getDoctorForHospital(
  //   @Request() req,
  //   @Param('doctorId') doctorId: number,
  //   @Query('pageSize') pageSize?: number,
  //   @Query('pageOffset') pageOffset?: number,
  //   @Query('firstName') firstName?: string,
  //   @Query('lastName') lastName?: string,
  //   @Query('email') email?: string,
  //   @Query('phoneNumber') phoneNumber?: string,
  //   @Query('speciality') speciality?: string,
  //   @Query('doctorCode') doctorCode?: string,
  //   @Query('gender') gender?: Gender,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  // ): Promise<ListDoctorPageDto> {
  //   const { user } = req;
  //   const listdoc = await this.doctorsService.getFilteredDoctors(
  //     +pageSize,
  //     +pageOffset,
  //     firstName,
  //     lastName,
  //     email,
  //     phoneNumber,
  //     speciality,
  //     doctorCode,
  //     gender,
  //     sortBy,
  //     sortOrder,
  //     user.id,
  //     +doctorId,undefined,undefined,undefined,
  //     false
  //   );
  //   return listdoc;
  // }

  // @ApiOperation({summary: "export doctors data by hospital"})
  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  // @Get('/hospitals/:hospitalId/doctors/export')
  // @HttpCode(HttpStatus.OK)
  // async exportVehicleData(@Param('hospitalId') hospitalId: number,@Res() res) {
  //   const data = await this.doctorsService.exportDoctorsDetailsForHospital(+hospitalId);

  //   // Create a workbook and add a worksheet
  //   const ws = xlsx.utils.aoa_to_sheet(data);
  //   const wb = xlsx.utils.book_new();
  //   xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');

  //   // Save the workbook to a buffer
  //   const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

  //   // Set the response headers
  //   res.set({
  //     'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     'Content-Disposition': 'attachment; filename=doctorDetails.xlsx',
  //   });

  //   // Send the buffer as the response
  //   res.send(buffer);
  // }

  
  // @ApiOperation({summary:'Doctor bulk data upload'})
  // @ApiBody({ type: FileDto })
  // @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  // @UseInterceptors(FileInterceptor('file'))
  // // @UseGuards(AuthGuard, RolesGuard)
  // @HttpCode(HttpStatus.CREATED)
  // @Post('/hospitals/:hospitalId/doctors/bulkupload')
  // @HttpCode(HttpStatus.CREATED)
  // // @ApiOkResponse({ type: ListHospitalDto })
  // bulkUploadDoctorData(
  //   @Param('hospitalId') hospitalId: number,
  //   @Body() fileDto : FileDto ,
  //   @UploadedFile(
  //       new ParseFilePipeBuilder()
  //       // .addFileTypeValidator({
  //       //     fileType: 'xlsx',
  //       // },)
  //       .addMaxSizeValidator({
  //           maxSize: 1048576 * 2 //2Mb
  //       })
  //       .build({
  //           errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  //       }),
  //   )
  //   file: Express.Multer.File,
  // )
  // // : Promise<ListHospitalDto> 
  // {
  //   return this.doctorsService.bulkUploadDoctorData(+hospitalId, fileDto,file);
  // }

  //   @ApiOperation({summary:'bulk doctor data upload'})
  //   @ApiBody({ type: FileDto })
  //   @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  //   @UseInterceptors(FileInterceptor('file'))
  //   // @UseGuards(AuthGuard, RolesGuard)
  //   @HttpCode(HttpStatus.CREATED)
  //   @Post('/hospitals/:hospitalId/buildings/:buildingId/floors/:floorId/flats/:flatId/bulkupload')
  //   @HttpCode(HttpStatus.CREATED)
  //   // @ApiOkResponse({ type: ListHospitalDto })
  //   bulkUploadHospitalData(
  //     @Param('hospitalId') hospitalId: number,
  //     @Param('buildingId') buildingId: number,
  //     @Param('floorId') floorId: number,
  //     @Param('flatId') flatId: number,
  //     @Body() fileDto : FileDto ,
  //     @UploadedFile(
  //         new ParseFilePipeBuilder()
  //         // .addFileTypeValidator({
  //         //     fileType: 'xlsx',
  //         // },)
  //         .addMaxSizeValidator({
  //             maxSize: 1048576 * 2 //2Mb
  //         })
  //         .build({
  //             errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  //         }),
  //     )
  //     file: Express.Multer.File,
  //   )
  //   // : Promise<ListHospitalDto> 
  //   {
  //     return this.doctorsService.bulkUploadDoctorsData(+hospitalId,+buildingId,+floorId,+flatId, fileDto,file);
  //   }

  @ApiOperation({summary: "add doctors for the hospital"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Post('/hospitals/:hospitalId/doctors')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: DoctorDto })
  add(
    @Param('hospitalId') hospitalId: number,
    @Body() addDoctorDto: AddDoctorDto
  ): Promise<DoctorDto> {
    return this.doctorsService.add(+hospitalId, addDoctorDto);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Get('/hospitals/:hospitalId/doctors/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewDoctorDto })
  findById(
    @Param('hospitalId') hospitalId: number,
    @Param('id') id: number,
    @Request() req
  ): Promise<ViewDoctorDto> {
    // const { user } = req;
    return this.doctorsService.findById(+hospitalId, +id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Put('/hospitals/:hospitalId/doctors/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DoctorDto })
  edit(
    @Param('hospitalId') hospitalId: number,
    @Body() doctorDto: AddDoctorDto,
    @Param('id') id: number
  ): Promise<DoctorDto> {
    return this.doctorsService.edit(+hospitalId, doctorDto, id);
  }



  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Get('/hospitals/:hospitalId/doctors')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListDoctorPageDto })
  async getFilteredPosts(
    @Request() req,
    @Param('hospitalId') hospitalId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('speciality') speciality?: string,
    @Query('doctorCode') doctorCode?: string,
    // @Query('gender') gender?: Gender,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListDoctorPageDto> {
    const { doctor } = req;
    const listdoctor = await this.doctorsService.getFilteredDoctors(
      +pageSize,
      +pageOffset,
      firstName,
      lastName,
      email,
      phoneNumber,
      speciality,
      doctorCode,
      // gender,
      sortBy,
      sortOrder,
      doctor.id,
      +hospitalId,
      true
    );
    return listdoctor;
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Delete('/hospitals/:hospitalId/doctors/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  delete( @Param('hospitalId') hospitalId: number,
 @Param('id') id: number) {
    return this.doctorsService.deleteDoctor(+hospitalId, +id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Post('/hospitals/:hospitalId/doctors/:id/:status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  softDelete(
    @Param('hospitalId') hospitalId: number,
    @Param('id') id: number,
    @Param('status') status: string
  ) {
    return this.doctorsService.softDeleteDoctor(+hospitalId, +id, status);
  }
}

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
import { PatientsService } from './patients.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListPatientPageDto } from './dto/list-patient-page.dto';
import { PatientDto } from './dto/patient.dto';
import { AddPatientDto } from './dto/add-patient.dto';
import { ViewPatientDto } from './dto/view-patient.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../core/dto/page-base.dto';
import * as xlsx from 'xlsx';
import { Gender } from '@prisma/client';

@ApiTags('patients')
@Controller()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  // @Get('/hospitals/:hospitalId/patients')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: ListPatientPageDto })
  // async getPatientForHospital(
  //   @Request() req,
  //   @Param('patientId') patientId: number,
  //   @Query('pageSize') pageSize?: number,
  //   @Query('pageOffset') pageOffset?: number,
  //   @Query('firstName') firstName?: string,
  //   @Query('lastName') lastName?: string,
  //   @Query('email') email?: string,
  //   @Query('phoneNumber') phoneNumber?: string,
  //   @Query('speciality') speciality?: string,
  //   @Query('patientCode') patientCode?: string,
  //   @Query('gender') gender?: Gender,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  // ): Promise<ListPatientPageDto> {
  //   const { user } = req;
  //   const listdoc = await this.patientsService.getFilteredPatients(
  //     +pageSize,
  //     +pageOffset,
  //     firstName,
  //     lastName,
  //     email,
  //     phoneNumber,
  //     speciality,
  //     patientCode,
  //     gender,
  //     sortBy,
  //     sortOrder,
  //     user.id,
  //     +patientId,undefined,undefined,undefined,
  //     false
  //   );
  //   return listdoc;
  // }

  // @ApiOperation({summary: "export patients data by hospital"})
  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  // @Get('/hospitals/:hospitalId/patients/export')
  // @HttpCode(HttpStatus.OK)
  // async exportVehicleData(@Param('hospitalId') hospitalId: number,@Res() res) {
  //   const data = await this.patientsService.exportPatientsDetailsForHospital(+hospitalId);

  //   // Create a workbook and add a worksheet
  //   const ws = xlsx.utils.aoa_to_sheet(data);
  //   const wb = xlsx.utils.book_new();
  //   xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');

  //   // Save the workbook to a buffer
  //   const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

  //   // Set the response headers
  //   res.set({
  //     'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     'Content-Disposition': 'attachment; filename=patientDetails.xlsx',
  //   });

  //   // Send the buffer as the response
  //   res.send(buffer);
  // }

  
  // @ApiOperation({summary:'Patient bulk data upload'})
  // @ApiBody({ type: FileDto })
  // @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  // @UseInterceptors(FileInterceptor('file'))
  // // @UseGuards(AuthGuard, RolesGuard)
  // @HttpCode(HttpStatus.CREATED)
  // @Post('/hospitals/:hospitalId/patients/bulkupload')
  // @HttpCode(HttpStatus.CREATED)
  // // @ApiOkResponse({ type: ListHospitalDto })
  // bulkUploadPatientData(
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
  //   return this.patientsService.bulkUploadPatientData(+hospitalId, fileDto,file);
  // }

  //   @ApiOperation({summary:'bulk patient data upload'})
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
  //     return this.patientsService.bulkUploadPatientsData(+hospitalId,+buildingId,+floorId,+flatId, fileDto,file);
  //   }

  @ApiOperation({summary: "add patients for the hospital"})
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Post('/hospitals/:hospitalId/patients')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: PatientDto })
  add(
    @Param('hospitalId') hospitalId: number,
    @Body() addPatientDto: AddPatientDto
  ): Promise<PatientDto> {
    return this.patientsService.add(+hospitalId, addPatientDto);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Get('/hospitals/:hospitalId/patients/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ViewPatientDto })
  findById(
    @Param('hospitalId') hospitalId: number,
    @Param('id') id: number,
    @Request() req
  ): Promise<ViewPatientDto> {
    // const { user } = req;
    return this.patientsService.findById(+hospitalId, +id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Put('/hospitals/:hospitalId/patients/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PatientDto })
  edit(
    @Param('hospitalId') hospitalId: number,
    @Body() patientDto: AddPatientDto,
    @Param('id') id: number
  ): Promise<PatientDto> {
    return this.patientsService.edit(+hospitalId, patientDto, id);
  }



  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Get('/hospitals/:hospitalId/patients')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListPatientPageDto })
  async getFilteredPosts(
    @Request() req,
    @Param('hospitalId') hospitalId: number,
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('digitalHeathCode') digitalHeathCode?: string,
    // @Query('gender') gender?: Gender,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListPatientPageDto> {
    // const { patient } = req;
    const listpatient = await this.patientsService.getFilteredPatients(
      +pageSize,
      +pageOffset,
      firstName,
      lastName,
      email,
      phoneNumber,
      digitalHeathCode,
      // gender,
      sortBy,
      sortOrder,
      // patient.id,
      +hospitalId,
      true
    );
    return listpatient;
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Delete('/hospitals/:hospitalId/patients/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  delete( @Param('hospitalId') hospitalId: number,
 @Param('id') id: number) {
    return this.patientsService.deletePatient(+hospitalId, +id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @Post('/hospitals/:hospitalId/patients/:id/:status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse()
  softDelete(
    @Param('hospitalId') hospitalId: number,
    @Param('id') id: number,
    @Param('status') status: string
  ) {
    return this.patientsService.softDeletePatient(+hospitalId, +id, status);
  }
}

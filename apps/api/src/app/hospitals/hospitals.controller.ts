import {
  Controller,
  Get,
  Post,
  Request,
  Put,
  Query,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HospitalDto } from './dto/hospital.dto';
import { ListHospitalPageDto } from './dto/list-hospital-page.dto';
import { AddHospitalDto, AddHospitalResponseDto } from './dto/add-hospital.dto';
import { ListHospitalDto } from './dto/list-hospital.dto';
import { EditHospitalDto,EditHospitalStatusDto } from './dto/edit-hospital.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileDto } from '../core/dto/page-base.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('hospitals')
@Controller()
export class HospitalsController {
  constructor(private hospitalService: HospitalsService) {}

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN, Role.HOSPITAL_ADMIN)  
  @ApiOperation({summary: "add hospital"})
  @Post('/hospitals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: AddHospitalResponseDto })
  add(@Body() addHospitalDto: AddHospitalDto): Promise<AddHospitalResponseDto> {
    return this.hospitalService.add(addHospitalDto);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @ApiOperation({summary: "get hospitals by id"})
  @Get('hospitals/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListHospitalDto })
  findById(@Param('id') id: number): Promise<ListHospitalDto> {
    return this.hospitalService.findById(+id);
  }

  @ApiOperation({summary:'bulk hospital data upload'})
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data') // Specify the media type for file upload
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: "bulk upload hospital data"})
  @Post('hospitals/bulkupload')
  @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ type: ListHospitalDto })
  bulkUploadHospitalData(
    @Body() fileDto : FileDto ,
    @UploadedFile(
        new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //     fileType: 'xlsx',
        // },)
        .addMaxSizeValidator({
            maxSize: 1048576 * 2 //2Mb
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    )
    file: Express.Multer.File,
  )
  // : Promise<ListHospitalDto> 
  {
    return this.hospitalService.bulkUploadHospitalData(fileDto,file);
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @ApiOperation({summary: "Edit hospital"})
  @Put('hospitals/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: HospitalDto })
  edit(
    @Body() hospitalDto: EditHospitalDto,
    @Param('id') id: number
  ): Promise<HospitalDto> {
    return this.hospitalService.edit(hospitalDto, +id);
  }

  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  // @ApiOperation({summary: "get asset count for hospital by id"})
  // @Get('/:id/asset-count')
  // @HttpCode(HttpStatus.OK)
  // giveAssetCount(@Param('id') id: number){
  //   return this.hospitalService.giveAssetCount(+id);
  // }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @ApiOperation({summary: "Delete hospital"})
  @Delete('hospitals/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteHospital(@Param('id') id: number): Promise<void> {
    return this.hospitalService.deleteHospital(+id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.ORGANIZATION_ADMIN,Role.HOSPITAL_ADMIN)  
  @ApiOperation({summary: "Edit hospital active status"})
  @Put('hospitals/:id/status')
  @ApiOkResponse({ type: EditHospitalStatusDto })
  softDeleteHospital(@Body() editHospitalStatusDto: EditHospitalStatusDto, @Param('id') id: number): Promise<EditHospitalStatusDto> {
    return this.hospitalService.softDeleteHospital(+id, editHospitalStatusDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.POYV_ADMIN)
  @ApiOperation({ summary: "Get counts of all hospitals, active and inactive" })
  @Get('hospital-count')
  @HttpCode(HttpStatus.OK)
  getHospitalCounts() {
    return this.hospitalService.getHospitalCounts();
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.POYV_ADMIN, Role.HOSPITAL_ADMIN)  
  @ApiOperation({summary: "get filtered hospitals"})
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'pageOffset', type: 'number', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'city', type: 'string', required: false })
  @ApiQuery({ name: 'status', type: "'active'| 'inactive'| 'all'", required: false })
  @ApiQuery({ name: 'sortBy', type: 'string', required: false })
  @ApiQuery({ name: 'sortOrder', type: "'asc' | 'desc'", required: false })
  @Get('hospitals')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListHospitalPageDto })
  async getFilteredHospitals(
    @Query('pageSize') pageSize?: number,
    @Query('pageOffset') pageOffset?: number,
    @Query('name') name?: string,
    @Query('city') city?: string,
    @Query('status') status?: 'active'| 'inactive'| 'all' ,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ): Promise<ListHospitalPageDto> {
    const listHospitals = await this.hospitalService.getFilteredHospitals(
      +pageSize,
      +pageOffset,
      name,
      city,
      status,
      sortBy,
      sortOrder
    );
    return listHospitals;
  }
}

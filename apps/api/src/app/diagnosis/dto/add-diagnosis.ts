import { AddDiagnosis } from "@healthcare/data-transfer-types";
import { OmitType } from "@nestjs/swagger";
import { DiagnosisDto } from "./diagnosis.dto";

export class AddDoctorDto extends OmitType(DiagnosisDto,['id']) implements AddDiagnosis {}
import { ListDiagnosis, ListDiagnosisPage } from "@healthcare/data-transfer-types";
import { ApiProperty } from "@nestjs/swagger";
import { PageBaseDto } from "../../core/dto/page-base.dto";
import { ListDiagnosisDto } from "./list-diagnosis.dto";

export class ListDiagnosisPageDto extends PageBaseDto implements ListDiagnosisPage{
    @ApiProperty({type:[ListDiagnosisDto]}) content: ListDiagnosisDto[];
}
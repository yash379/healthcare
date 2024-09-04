import { ViewDiagnosis } from "@healthcare/data-transfer-types";
import { ApiProperty } from "@nestjs/swagger";

export class ViewDiagnosisDto implements ViewDiagnosis {
    @ApiProperty() id: number;
    @ApiProperty() doctorId: number;
    @ApiProperty() patientId: number;
    @ApiProperty() details: string;
    @ApiProperty() height?: number;
    @ApiProperty() weight?: number;
    @ApiProperty() pulse?: number;
    @ApiProperty() spo2?: number;
    @ApiProperty() bmi?: number;
    @ApiProperty() temperature?: number;
    @ApiProperty() chiefComplaints: string[];
    @ApiProperty() diagnosisDate: string; 
}

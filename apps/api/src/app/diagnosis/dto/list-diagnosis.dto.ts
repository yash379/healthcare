import { ListDiagnosis } from "@healthcare/data-transfer-types";
import { PickType } from "@nestjs/swagger";
import { ViewDiagnosis } from "@healthcare/data-transfer-types";
import { ViewDiagnosisDto } from "./view-diagnosis.dto";

export class ListDiagnosisDto
  extends PickType(ViewDiagnosisDto,[
    'id',
    'doctorId',
    'patientId',
    'height',
    'weight',
    'pulse',
    'spo2',
    'bmi',
    'temperature',
    'chiefComplaints',
    'diagnosisDate'

  ])
  implements ListDiagnosis {}
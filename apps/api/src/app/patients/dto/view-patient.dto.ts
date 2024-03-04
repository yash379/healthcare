import { ViewResident } from '@healthcare/data-transfer-types';


export class ViewResidentDto implements ViewResident {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  isActive: boolean;
}

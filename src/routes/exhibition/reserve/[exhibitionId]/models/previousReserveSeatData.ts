import type { ReservationStatusEnum } from "../../../../../models/reserveSeat";
import type { CompanyModel } from "../../../../company-registration/models/company";
export interface PreviousSeatService {
  comment: string;
  created_at: string;
  object_id: string;
  service_id: string;
  exhibition_id: number;
  status: ReservationStatusEnum;
  company: CompanyModel;

}
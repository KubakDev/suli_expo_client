export interface ReserveSeatModel {
  status: ReservationStatusEnum;
  exhibition_id: number;
  object_id: number;
  services: number[];
  company_id: number;
}
export enum ReservationStatusEnum {
  ACCEPT = "Accept",
  PENDING = "Pending",
}
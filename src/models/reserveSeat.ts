export interface ReserveSeatModel {
	status: ReservationStatusEnum;
	exhibition_id: number;
	object_id: number;
	services: { serviceId: number; totalPrice: number }[];
	company_id: number;
	comment?: string;
	total_price:number;
}
export enum ReservationStatusEnum {
  ACCEPT = "accept",
  PENDING = "pending",
  REJECT = "reject",
}

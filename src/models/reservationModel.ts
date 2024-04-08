import type { ExhibitionModel } from './exhibitionModel';

export interface Reservation {
	comment: string;
	company_id: number;
	created_at: string;
	exhibition: ExhibitionModel;
	exhibition_id: number;
	file_url: string;
	id: number;
	object_id: number;
	reserved_area: string;
	reserved_areas: string;
	services: string;
	status: ReservationStatus;
	extra_discount_checked?: boolean;
	type?: string;
	rejected_by_user?: boolean;
}
export enum ReservationStatus {
	PENDING = 'pending',
	ACCEPT = 'accept',
	REJECT = 'reject'
}

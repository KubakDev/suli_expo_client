import type { ExhibitionModel } from './exhibitionModel';

export interface Reservation {
	comment: string;
	company_id: number;
	created_at: string;
	exhibition: ExhibitionModel;
	exhibition_id: number;
	file_url?: string;
	id: number;
	object_id: number;
	reserved_area: string;
	reserved_areas: string;
	services: string[];
	status: ReservationStatus;
	extra_discount_checked?: boolean;
	type?: string;
	rejected_by_user?: boolean;
	total_price: number;
}

export enum ReservationStatus {
	PENDING = 'pending',
	ACCEPT = 'accept',
	REJECT = 'reject'
}

// src/models/seatLayoutModel.ts
export interface SeatPrivacyPolicyLang {
	language: string;
	description_seat: string;
	price_sign: string;
}

export interface SeatLayout {
	is_active: boolean;
	seat_privacy_policy_lang: SeatPrivacyPolicyLang[];
	excel_preview_url?: string;
	price_per_meter: number;
	discounted_price?: number;
	extra_discount?: number;
	areas?: string;
	services: string;
	type: string;
}

export interface ReservedSeatArea {
	id: number;
	area: string;
	quantity: number;
}

export interface ReservedService {
	serviceId: number;
	quantity: number;
	totalPrice: number;
	serviceDetail: ServiceDetail;
}

export interface ServiceDetail {
	id: number;
	price: number;
	discount?: number;
	maxFreeCount?: number;
	unlimitedFree?: boolean;
	languages: { title: string }[];
	icon: string;
}

export interface ReservedSeatData {
	area: ReservedSeatArea[];
	services: ReservedService[];
	extraDiscountChecked?: boolean;
	comment: string;
	total_price: number;
	file?: File;
}

export interface DetailedService extends ServiceDetail {
	selected: boolean;
	quantity: number;
	totalPrice: number;
	maxFreeCount: number;
	unlimitedFree: boolean;
}

export interface ServiceArrayItem {
	serviceId: number;
	maxQuantityPerUser: number;
	maxFreeCount: number;
	unlimitedFree: boolean;
	serviceDetail: ServiceDetail;
}

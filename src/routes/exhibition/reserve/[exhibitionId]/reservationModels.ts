import type { LanguageEnum } from "../../../../../../suli_expo_panel/src/models/languageEnum";

export interface SelectedSeatService {
  id: number;
  isFree: boolean;
  serviceDetail: ServiceDetail;
  maxQuantityPerUser: number;
  unlimitedFree: boolean;
  maxFreeCount: number;
}
export interface ServiceDetail {
  id: number;
  created_at: string;
  icon: string;
  price: number;
  languages: SeatServiceLanguage[];
  quantity?: number;
  discount?: number;
}
export interface SeatServiceLanguage {
  id: number;
  created_at: string;
  title: string;
  seat_service_id: number;
  description: string;
  language: LanguageEnum
}
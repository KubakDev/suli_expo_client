import { writable } from "svelte/store";
import type { SelectedSeatService } from "./reservationModels";


export let selectedSeat = writable<any>();
export let selectedFreeSeatServices = writable<SelectedSeatService[]>([]);
export let selectedPaidSeatServices = writable<SelectedSeatService[]>([]);
export let seatDataLoading = writable<boolean>(false);
export function addSelectedSeat(seat: any) {
  selectedSeat.set(seat);
}
export function addSelectedFreeSeatServices(seatServices: any) {
  selectedFreeSeatServices.set(seatServices);
}
export function addSelectedPaidSeatServices(seatServices: any) {
  selectedPaidSeatServices.set(seatServices);
}
export function setSeatDataLoading(value: boolean) {
  seatDataLoading.set(value);
}
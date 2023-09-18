import { derived, writable } from "svelte/store";
import type { SelectedSeatService } from "./reservationModels";
import type { PreviousSeatService } from "./models/previousReserveSeatData";
import { ReservationStatusEnum } from "../../../../models/reserveSeat";


export let selectedSeat = writable<any>();
export let selectedFreeSeatServices = writable<SelectedSeatService[]>([]);
export let selectedPaidSeatServices = writable<SelectedSeatService[]>([]);
export let seatDataLoading = writable<boolean>(false);
export let previousReserveSeatData = writable<PreviousSeatService[]>();
export function addSelectedSeat(seat: any) {
  selectedSeat.set(seat);
}
export function addPreviousReserveSeatData(data: PreviousSeatService[]) {
  previousReserveSeatData.set(data);
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

export const totalReservedSeat = derived(
  [previousReserveSeatData, selectedSeat],
  ([$previousReserveSeatData, $selectedSeat]) => {
    let result = 0
    $previousReserveSeatData.map((x) => {
      if (x.status != ReservationStatusEnum.REJECT)
        if (x.object_id == $selectedSeat?.id) {
          result++;
        }
    });
    return result;
  }
);
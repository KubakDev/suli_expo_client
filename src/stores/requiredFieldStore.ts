// customStore.js
import { writable } from 'svelte/store';

export const requiredFields = writable<string[]>([]);
export const exhibitionID = writable<number>();

export function setRequiredFields(fields: string[]) {
	requiredFields.set(fields);
}

export function setExhibitionID(id: number) {
	exhibitionID.set(id);
}

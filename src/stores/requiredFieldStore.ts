// customStore.js
import { writable } from 'svelte/store';

export const requiredFields = writable<string[]>([]);
export const exhibitionID = writable();

export function setRequiredFields(fields: any) {
	requiredFields.set(fields);
}

export function setExhibitionID(fields: any) {
	exhibitionID.set(fields);
}

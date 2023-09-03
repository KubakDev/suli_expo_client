import { writable } from "svelte/store";

export const asc = writable(true);

const createAscStore = ()=>{
    const { subscribe, set, update } = writable(true);

    return {
		subscribe,
		set: (asc: boolean) => {
			set(asc);
		}
    };
}

export const ascStore = createAscStore();

import { writable } from "svelte/store";

export const contactDataStore = writable({
    name: "Hello",
    email: "",
    phone: "",
    message: "",
});
import { writable } from 'svelte/store';
import { page } from '$app/stores';

// Create a custom store
export const previousPageStore = writable('');

// Subscribe to the page store

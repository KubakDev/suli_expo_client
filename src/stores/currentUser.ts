import { writable } from 'svelte/store';


const currentUserStore = () => {
  const { subscribe, set, update } = writable<any>({});
  return {
    subscribe,
    set: (userInfo: any) => {
      set(userInfo);
    },

  };
};

export const currentUser = currentUserStore();

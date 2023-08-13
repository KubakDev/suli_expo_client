import { writable } from 'svelte/store';


const currentUserStore = () => {
  const { subscribe, set, update } = writable({});
  return {
    subscribe,
    set: (userInfo: any) => {
      console.log('set', userInfo);
      set(userInfo);
    },

  };
};

export const currentUser = currentUserStore();

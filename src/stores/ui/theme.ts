import { writable } from 'svelte/store';
import type { activeTheme } from '../../models/theme';
import type { SupabaseClient } from '@supabase/supabase-js';


const themeStore = () => {
  const { subscribe, set, update } = writable<activeTheme>()
  return {
    subscribe,
    getActiveTheme: async (supabase: SupabaseClient) => {

      const { data, error } = await supabase.from('color_palette').select('*').eq('active', true).single();


      if (error) return;
      const root = document.documentElement;
      for (let color in data) {
        if (color === 'active' || color === 'id' || color === 'name') continue;
        root.style.setProperty(`--${color}`, data[color]);
        console.log("Colors ",`--${color}`, data[color]);
      }
      root.style.setProperty('--transparentSecondaryColor', data.secondaryColor + '80');
      root.style.setProperty('--transparentPrimaryColor', data.primaryColor + '80');

      root.style.setProperty('--primaryColor', data.primaryColor);
      set(data)
    },
    reAddColors: () => {

      update((data) => {
        const root = document.documentElement;
        for (let color in data) {
          if (color === 'active' || color === 'id' || color === 'name') continue;
          //@ts-ignore
          root.style.setProperty(`--${color}`, data[color]);
        }
        root.style.setProperty('--transparentSecondaryColor', data.secondaryColor + '80');

        root.style.setProperty('--transparentPrimaryColor', data.primaryColor+"80");
        return data;
      });

    }
  }
}
export const activeThemeStore = themeStore();
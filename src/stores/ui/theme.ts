import { writable } from 'svelte/store';
import type { activeTheme } from '../../models/theme';
import type { SupabaseClient } from '@supabase/supabase-js';


const themeStore = () => {
  const { subscribe, set } = writable<activeTheme>()
  return {
    subscribe,
    getActiveTheme: async (supabase: SupabaseClient) => {
      console.log(supabase)
      const { data, error } = await supabase.from('color_palette').select('*').eq('active', true).single();
      console.log(data);

      if (error) return;
      const root = document.documentElement;
      for (let color in data) {
        console.log(color)
        if (color === 'active' || color === 'id' || color === 'name') continue;
        root.style.setProperty(`--${color}`, data[color]);
        console.log("Colors ",`--${color}`, data[color]);
      }
      root.style.setProperty('--transparentSecondaryColor', data.secondaryColor + '80');
      root.style.setProperty('--transparentPrimaryColor', data.primaryColor + '80');

      root.style.setProperty('--primaryColor', data.primaryColor);
      set(data)
    }
  }
}
export const activeThemeStore = themeStore();
import { writable } from "svelte/store";
import type { ColorTheme } from "../models/colorTheme";

const currentThemeColors = writable<ColorTheme>({
  backgroundColor: "var(--lightBackgroundColor)",
  primaryColor: "var(--lightPrimaryColor)",
  overlayBackgroundColor: "var(--lightOverlayBackgroundColor)",
  overlayPrimaryColor: "var(--lightOverlayPrimaryColor)",
  overlaySecondaryColor: "var(--lightOverlaySecondaryColor)",
  secondaryColor: "var(--lightSecondaryColor)"
})

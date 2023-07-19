import type { activeTheme } from "./theme";

export interface PageLayout {
    id?: number;
    created_at: Date;
    component: Component;
    component_type: ComponentType;
    page: string;
    color_palette:Color_Palette;
}

export interface Component {
    title: string;
    component_id: number;
}

export interface ComponentType {
    type: string;
}

export interface Color_Palette {
    primaryColor: string;
    secondaryColor: string;
    onSecondaryColor: string;
    onPrimaryColor: string;
    backgroundColor: string;
    onBackgroundColor: string;
}


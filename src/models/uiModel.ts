import type { CardType } from 'kubak-svelte-component';
import type { ColorTheme } from './colorTheme';

export interface UiModel {
	id: number;
	component_type: ComponentType;
	component: Component;
	color_palette: ColorTheme;
}

export interface Component {
	title: string;
}
export interface ComponentType {
	id: number;
	type: CardType;
}

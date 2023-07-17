import type { ColorTheme } from './colorTheme';
import type { ExhibitionSectionTypeModel } from './exhibitionSectionModel';

export interface ExhibitionModel {
	id?: number;
	title: string;
	video_youtube_link: string;
	images: string[];
	thumbnail: string;
	exhibition_date: Date;
	description?: string;
	created_at?: Date;
	sections: ExhibitionSectionTypeModel[];
	color_palette?: ColorTheme;
	country_number: number;
	company_number: number;
	seat_layout?: any;
	pdf_files: string[];
	start_date?: Date;
	end_date?: Date;
	story?: string;
}

import type { ColorTheme } from './colorTheme';
import type { ExhibitionSectionTypeModel } from './exhibitionSectionModel';

export interface ExhibitionModel {
	id?: number;
	exhibition_type: string;
	title: string;
	video_youtube_link: string;
	images: string[];
	image_map: string;
	thumbnail: string;
	exhibition_date: Date;
	description?: string;
	created_at?: Date;
	sections: ExhibitionSectionTypeModel[];
	color_palette?: ColorTheme;
	country_number: number;
	company_number: number;
	seat_layout?: any;
	pdf_files: string;
	contract_file: string;

	start_date?: Date;
	end_date?: Date;
	story?: string;
	location: string;
	location_title: string;
	sponsor_images?: string[];
	sponsor_title?: string;
	brochure?: string;
	map_title?: string;
	deleted_status: string | null;
	exhibition_languages: ExhibitionLanguagesModel[];
}

export interface ExhibitionLanguagesModel {
	id: number;
	language: string;
	title: string;
	description: string;
	exhibition_id: number;
	video_youtube_link: string;
	story: string;
	location: string;
	location_title: string;
	pdf_files: string;
	brochure: string;
	map_title: string;
	contract_file: string;
}
export interface ExhibitionPaginatedModel {
	data: ExhibitionModel[];
	page: number;
	count: number;
	pages: number;
}

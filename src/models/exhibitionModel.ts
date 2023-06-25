import type { ExhibitionSectionTypeModel } from './exhibitionSectionModel';

export interface ExhibitionModel {
	id?: number;
	title: string;
	images: string[];
	thumbnail: string;
	exhibition_date: Date;
	description?: string;
	created_at?: Date;
	sections: ExhibitionSectionTypeModel[];
}

import type { ExhibitionSectionTypeModel } from './exhibitionSectionModel';

export interface ExhibitionModel {
	id?: number;
	title: string;
	images: string[];
	thumbnail: string;
	description?: string;
	created_at?: Date;
	sections: ExhibitionSectionTypeModel[];
}

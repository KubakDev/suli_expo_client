export enum ExhibitionSectionTypeEnum {
	News = 'news',
	Gallery = 'gallery',
	Magazine = 'magazine',
	Videos = 'videos',
	Publishing = 'publishing'
}

export interface ExhibitionSectionTypeModel {
	id: number;
	exhibition_id: number;
	section: ExhibitionSectionTypeEnum;
	sq_no: number;
}

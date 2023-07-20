export interface ServiceModel {
	id?: number;
	title?: string;
	thumbnail?: string;
	short_description?: string;
	primaryColor?: string;
	onPrimaryColor?: string;
	created_at?: Date;
}

export interface ServicePaginatedModel {
	data: ServiceModel[];
	page: number;
	count: number;
	pages: number;
}

export interface VideoModel {
	id?: number;
	title: string;
	link: string;
	thumbnail: string;
	long_description?: string;
	short_description?: string;
}

export interface VideoPaginatedModel {
	data: VideoModel[];
	page: number;
	count: number;
	pages: number;
}

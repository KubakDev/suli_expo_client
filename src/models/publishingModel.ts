export interface PublishingModel {
	id?: number;
	title: string;
	thumbnail: string;
	images: string[];
	imagesCarousel: CarouselImage[];
	long_description?: string;
	short_description?: string;
}

interface CarouselImage {
	id: number;
	name: string;
	imgurl: string;
	attribution: string;
}

export interface PublishingPaginatedModel {
	data: PublishingModel[];
	page: number;
	count: number;
	pages: number;
}

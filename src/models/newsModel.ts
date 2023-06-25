export interface NewsModel {
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

export interface NewsPaginatedModel {
	data: NewsModel[];
	page: number;
	count: number;
}

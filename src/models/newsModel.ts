import type { ColorTheme } from "./colorTheme";

export interface NewsModel {
	id?: number;
	title: string;
	thumbnail: string;
	images: string[];
	created_at: Date;
	imagesCarousel: CarouselImage[];
	color_palette?: ColorTheme;
	long_description?: string;
	short_description?: string;
	news_date: Date;
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
	pages: number;
}

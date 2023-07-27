import type { ColorTheme } from "./colorTheme";

export interface GalleryModel {
	id?: number;
	title: string;
	thumbnail: string;
	images: string[];
	imagesCarousel: CarouselImage[];
	color_palette?: ColorTheme;
	long_description?: string;
	short_description?: string;
}

interface CarouselImage {
	id: number;
	name: string;
	imgurl: string;
	attribution: string;
}

export interface GalleryPaginatedModel {
	data: GalleryModel[];
	page: number;
	count: number;
	pages: number;
}

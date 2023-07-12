import type { ColorTheme } from "./colorTheme";

export interface MagazineModel {
	id?: number;
	title: string;
	thumbnail: string;
	images: string[];
	imagesCarousel: CarouselImage[];
	pdf_files: string[];
	color_palette?: ColorTheme;
	created_at?: Date;
	long_description?: string;
	short_description?: string;
}

interface CarouselImage {
	id: number;
	name: string;
	imgurl: string;
	attribution: string;
}

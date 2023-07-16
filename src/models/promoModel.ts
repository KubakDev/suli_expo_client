export interface PromoModel {
	id: string;
	created_at: Date;
	thumbnail: string;
    video: PromoLanguagesModel[];
	exhibition_id: string;
}

export interface PromoLanguagesModel {
    id: string;
    created_at: Date;
    title: string;
    video_link: string;
    video_id: string;
    language: string;
}

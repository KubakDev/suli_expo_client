export interface NewsModel {
	id: number;
	title: string;
	thumbnail: string;
	images: string[];
	long_description: string;
	short_description: string;
}

export function convertToNewsModel(data: any) {
	let newsModel = {
		id: data.id,
		title: data.news_languages[0].title,
		thumbnail: data.thumbnail,
		images: data.images
			.split(',')
			.map(
				(e: string) =>
					'https://egnwlzzlqqwrpvnvvwrr.supabase.co/storage/v1/object/public/image/' + e
			),
		long_description: data.news_languages[0].long_description,
		short_description: data.news_languages[0].short_description
	};

	return newsModel;
}

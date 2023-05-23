export interface ExhibitionModel {
	id?: number;
	title?: string;
	images?: string[];
	description?: string;
	created_at?: Date;
}

export function convertToExhibitionModel(data: any) {
	let exhibitionModel = {
		id: data?.id,
		title: data?.title,
		description: data?.description,
		images: data?.images,
		created_at: data?.created_at
	};

	return exhibitionModel;
}

export function convertModel<T>(data: any, isNewsModel: boolean = false) {
	let lang = data.languages[0];
	let obj = {} as T;

	for (let prop in data) {
		if (prop !== 'languages') {
			if (prop === 'images') {
				if (!data[prop]) continue;
				obj[prop] = data[prop]?.map((e: string) => {
					return import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + e;
				});
				if (isNewsModel) {
					obj['imagesCarousel'] = data[prop]?.map((e: string, i: number) => {
						return {
							id: i,
							name: e,
							imgurl: import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + e,
							attribution: ''
						};
					});
				}
			} else if (prop === 'sponsor_images') {
				obj[prop] = data[prop]?.map((e: string) => {
					return import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + e;
				});
			} else if (prop === 'thumbnail' || prop === 'image') {
				if (!data[prop]) continue;
				obj[prop] = import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + data[prop];
			} else if (prop === 'pdf_files') {
				obj[prop] = data[prop]?.map((e: string) => {
					return import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_PDF_URL + '/' + e;
				});
			} else {
				obj[prop] = data[prop];
			}

			for (let prop2 in lang) {
				if (prop2 !== 'id') {
					obj[prop2] = lang[prop2];
				}
			}
		}
	}

	return obj;
}


export interface ItemModel {
	id: number;
	title: string;
	thumbnail: string;
	short_description?: string;
}

export function modelToItemModel<T>(data: T): ItemModel {
	let newModel: ItemModel = {} as ItemModel;
	// convert T to ItemModel

	for (let prop in data) {
		if (prop === 'title' || prop === 'short_description' || prop === 'id' || prop === 'thumbnail') {
			// @ts-ignore
			newModel[prop] = data[prop];
		}
	}
	return newModel;
}

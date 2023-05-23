export function convertModel<T>(data: any) {
	let lang = data.languages[0];
	// create new object for type T
	let obj = {} as T;
	// loop through all properties of data
	for (let prop in data) {
		// add all properties from lang to obj
		if (prop !== 'languages') {
			// @ts-ignore
			obj[prop] = data[prop];
			for (let prop2 in lang) {
				// @ts-ignore
				obj[prop2] = lang[prop2];
			}
		}
	}

	return obj;
}

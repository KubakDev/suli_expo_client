export function stringToEnum<T extends Record<string, string | number>>(
	value: string,
	enumeration: T
): T[keyof T] | undefined {
	
	return enumeration[value as keyof T];
}

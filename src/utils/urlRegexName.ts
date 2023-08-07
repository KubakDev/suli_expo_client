export function getNameRegex(str: string): string {
    const pattern = /^\/([\w]+)\/?/;
    const match = str.match(pattern) || [];
    return match[1];
}
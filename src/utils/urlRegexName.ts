export function getNameRegex(str: string): string {
    const pattern = /^\/([\w]+)\/?/;
    const match = str.match(pattern) || [];
    console.log('match', match);
    
    return match[1];
}
export function toCamelCase(str:string|number) {
    if (str===null||str===undefined)return ''
    const words=str.toString().trim().split(" ");
    if (words.length > 0) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    }
    return words.join(" ")
}
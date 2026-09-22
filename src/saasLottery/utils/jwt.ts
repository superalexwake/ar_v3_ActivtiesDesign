export function parseJWT(token:string) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return {
            header:{},
            payload:{}
        }
    }
    function base64UrlDecode(base64Url:string) {
        base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return atob(base64Url);
    }
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload };
}
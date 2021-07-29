const BASE_URL = 'http://www.escapefromtarkov.wikia.com/api/v1';
const DEFAULT_FETCH_OPTIONS = {};//mode: 'no-cors' };

const buildUrl = (url, params) => {
    const urlWithParams = new URL(url);
    Object.keys(params).forEach(key => urlWithParams.searchParams.append(key, params[key]));
    return urlWithParams;
};


export default {
    getArticlesList: async (params) => {
        const rawRes = await fetch(buildUrl(BASE_URL + '/Articles/List', params), {
            ...DEFAULT_FETCH_OPTIONS,
            headers: {
                "User-Agent": "Wikia JavaScript (https://github.com/pollen5/wikia)",
                "Accept-Encoding": "gzip",
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        console.log(rawRes);
        const json = await rawRes.json();
        return json;
    }
}
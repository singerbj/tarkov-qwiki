const WIKI_URL = 'http://www.escapefromtarkov.wikia.com';
const API_URL = WIKI_URL + '/api/v1';
const JSON_FETCH_OPTIONS = {
    headers: {
        "User-Agent": "Wikia JavaScript (https://github.com/pollen5/wikia)",
        "Accept-Encoding": "gzip",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
};

const WIKI_FETCH_OPTIONS = {
    headers: {}
};

const buildUrl = (url, params) => {
    const urlWithParams = new URL(url);
    Object.keys(params).forEach(key => urlWithParams.searchParams.append(key, params[key]));
    return urlWithParams;
};


export default {
    getArticlesList: async (params = {}) => {
        const rawRes = await fetch(buildUrl(API_URL + '/Articles/List', params), {
            ...JSON_FETCH_OPTIONS
        });
        const json = await rawRes.json();
        return json;
    },
    getArticleDetails: async (ids, params = {}) => {
        if (Array.isArray(ids)) ids = ids.join(",");
        const rawRes = await fetch(buildUrl(API_URL + '/Articles/Details', { ids, ...params }), {
            ...JSON_FETCH_OPTIONS,
        });
        const json = await rawRes.json();
        return json;
    },
    getArticle: async (wikiRoute) => {
        const rawRes = await fetch(buildUrl(WIKI_URL + wikiRoute, {}), {
            ...WIKI_FETCH_OPTIONS
        });
        const text = await rawRes.text();
        return text;
    },

}
import axios from 'axios';

const WIKI_URL = 'http://www.escapefromtarkov.wikia.com';
const WIKI_IMG_URL = 'http://www.escapefromtarkov.wikia.com';
const WIKI_IMG_FULL_URL = 'http://www.escapefromtarkov.wikia.com/wiki/Special:Redirect/file/'
const API_URL = WIKI_URL + '/api/v1';
const JSON_FETCH_OPTIONS = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
};

const WIKI_FETCH_OPTIONS = {
    headers: {}
};

const buildUrl = (url, params) => {
    const queryParams = Object.keys(params);
    if (queryParams.length > 0) {
        queryParams.forEach((queryParam, i) => {
            if (i === 0) {
                url += '?' + queryParam + '=' + params[queryParam];
            } else {
                url += '&' + queryParam + '=' + params[queryParam];
            }
        });
    }
    return url;
};


export default {
    WIKI_URL,
    WIKI_IMG_URL,
    WIKI_IMG_FULL_URL,
    API_URL,
    getArticlesList: async (params = {}) => {
        const response = await axios.get(buildUrl(API_URL + '/Articles/List', params), {
            ...JSON_FETCH_OPTIONS
        });
        return response.data;
    },
    getArticleDetails: async (ids, params = {}) => {
        if (Array.isArray(ids)) ids = ids.join(",");
        const response = await axios.get(buildUrl(API_URL + '/Articles/Details', { ids, ...params }), {
            ...JSON_FETCH_OPTIONS,
        });
        return response.data;
    },
    getArticleContent: async (wikiRoute) => {
        const response = await axios.get(buildUrl(WIKI_URL + wikiRoute + '?action=raw', {}), {
            ...WIKI_FETCH_OPTIONS
        });
        return response.data;
    },
}
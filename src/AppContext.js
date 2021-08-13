
import React, { useState, useEffect, useContext, createContext } from 'react';
import { AsyncStorage } from 'react-native';
import ApiHelper from './ApiHelper';
import wtf from 'wtf_wikipedia';
import Util from './Util';

export const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextWrapper = (props) => {
    const [articlesMap, setArticlesMap] = useState({});
    const [articlesIdMap, setArticlesIdMap] = useState({});
    const [articlesMapKeys, setArticlesMapKeys] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const [articlesLoaded, setArticlesLoaded] = useState(false);
    const [totalArticles, setTotalArticles] = useState(0);

    const getWikiMarkupJson = (article, markup) => {
        const markupWithTitle = markup.replace(/{{PAGENAME}}/g, article.title);
        const wikiMarkupJson = wtf(markupWithTitle).json();
        return wikiMarkupJson;
    };

    const getArticleContent = async (article) => {
        try {
            const wikiMarkup = await ApiHelper.getArticleContent(article.url);
            const wikiMarkupJson = getWikiMarkupJson(article, wikiMarkup);
            return wikiMarkupJson;
        } catch (e) {
            console.log(e);
        }
    };

    const refreshArticleData = async () => {
        try {
            const articles = await ApiHelper.getArticlesList({ limit: 99999, expand: true });
            const articlesMap = {};
            const articlesIdMap = {};

            setTotalArticles(articles.items.length);


            articles.items.forEach((article) => {
                articlesMap[article.title] = article;
                articlesIdMap[article.id] = article;
            });

            setArticlesMap(articlesMap);
            setArticlesIdMap(articlesIdMap);
            setArticlesMapKeys(Object.keys(articlesMap).sort().sort((a, b) => a.length - b.length));
            setArticlesLoaded(true);

        } catch (e) {
            console.log(e);
        }
    };

    const search = (searchText) => {
        let matchesFound = 0;
        let results = [];
        if (searchText && searchText.length > 0) {
            const formattedText = searchText.replace(/[^a-zA-Z\d:]/g, '').toLowerCase();
            for (let i = 0; i < articlesMapKeys.length; i += 1) {
                const key = articlesMapKeys[i];
                if (matchesFound >= 50) {
                    break;
                }
                const formattedKey = key.replace(/[^a-zA-Z\d:]/g, '').toLowerCase();
                const indexFound = formattedKey.indexOf(formattedText);

                if (indexFound > -1) {
                    matchesFound += 1;
                    if (!results[indexFound]) {
                        results[indexFound] = [];
                    }
                    results[indexFound].push({ key, formattedKey, article: articlesMap[key] });
                }
            }

            results = results.filter((indexFoundArray) => {
                return indexFoundArray !== undefined;
            });

            results = results.map((indexFoundArray) => {
                return indexFoundArray.sort((a, b) => a.formattedKey.length - b.formattedKey.length);
            });

            results = [].concat.apply([], results);

            results = results.map((sortedResult) => sortedResult.article);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <AppContext.Provider
            value={{
                articlesMap,
                articlesIdMap,
                refreshArticleData,
                search,
                searchResults,
                articlesLoaded,
                totalArticles,
                getArticleContent
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
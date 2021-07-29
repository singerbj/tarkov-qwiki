import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import * as Font from 'expo-font';
import Bender from './assets/fonts/Bender.otf';
import ApiHelper from './src/ApiHelper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// TODO: cache search results, get article data, make it work for mobile, remove textbox highlight, make http calls to wiki work on mobile


export default App = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const loadFonts = async () => {
        await Font.loadAsync({
            'bender': {
                uri: Bender,
                display: Font.FontDisplay.SWAP,
            },
        });
        setFontsLoaded(true);
    }

    const [searchText, setSearchText] = useState('');
    const [articlesMap, setArticlesMap] = useState({});
    const [articlesMapKeys, setArticlesMapKeys] = useState({});
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        loadFonts();

        (async () => {
            try {
                const articles = await ApiHelper.getArticlesList({ limit: 99999, expand: true });
                const articlesMap = {};
                const articlesIdMap = {};
                articles.items.forEach((article) => {
                    articlesMap[article.title] = article;
                    articlesIdMap[article.id] = article;
                });

                const test = articlesIdMap[Object.keys(articlesIdMap)[12]];
                console.log(test);

                // const articlesDetails = await ApiHelper.getArticleDetails(Object.keys(articlesIdMap), {});
                // console.log(articlesDetails.items[test.id]);

                const wikiPage = await ApiHelper.getArticle(test.url);
                console.log(wikiPage);

                setArticlesMap(articlesMap);
                setArticlesMapKeys(Object.keys(articlesMap).sort((a, b) => a.length - b.length));

            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const search = (searchText) => {
        let matchesFound = 0;
        let results = [];
        if (searchText && searchText.length > 0) {
            const formattedText = searchText.replace(/[^a-zA-Z\d:]/g, '').toLowerCase();
            for (let i = 0; i < articlesMapKeys.length; i += 1) {
                const key = articlesMapKeys[i];
                if (matchesFound >= 200) {
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

    if (!fontsLoaded) {
        return <View style={styles.outerContainer} />;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.outerContainer}>
                    <View style={styles.innerContainer}>
                        <TextInput
                            style={styles.searchBox}
                            onChangeText={(text) => {
                                setSearchText(text);
                                search(text.trim());
                            }}
                            value={searchText}
                            placeholder={'search'}
                            autoFocus={true}
                        />

                        {searchResults.map((searchResult) => {
                            return <Text style={styles.listItem} key={searchResult.id}>{searchResult.title}</Text>
                        })}

                    </View>
                </View>
                <StatusBar style="light" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#000',
        alignItems: 'center',
        fontFamily: 'bender',
        color: '#9a8866',
        height: '100%',
        width: '100%'
    },
    outerContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        fontFamily: 'bender',
        color: '#9a8866',
        fontSize: 18,
        padding: 10,
        height: '100%',
        width: '100%'
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        maxWidth: 900,
        fontFamily: 'bender',
        color: '#9a8866',
        fontSize: 18,
        height: '100%'
    },
    searchBox: {
        height: 40,
        width: '100%',
        borderColor: '#9a8866',
        borderWidth: 1,
        padding: 10,
        fontFamily: 'bender',
        color: '#9a8866',
        fontSize: 18,
        placeholderTextColor: '#9a8866', // disable this only on mobile?
        outlineWidth: 0
    },
    listItem: {
        height: 40,
        width: '100%',
        padding: 10,
        borderColor: '#9a8866',
        borderWidth: 1,
        marginTop: 5,
        fontFamily: 'bender',
        color: '#9a8866',
        fontSize: 18
    }
});

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import * as Font from 'expo-font';
import Bender from './assets/fonts/Bender.otf';
import ApiHelper from './src/ApiHelper';

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
                articles.items.forEach((article) => {
                    articlesMap[article.title] = article;
                });

                setArticlesMap(articlesMap);
                setArticlesMapKeys(Object.keys(articlesMap));
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const search = (text) => {
        const results = [];
        if (text && text.length > 0) {
            const formattedText = text.replace(/[^a-zA-Z\d:]/g, '').toLowerCase();
            for (let i = 0; i < articlesMapKeys.length; i += 1) {
                const key = articlesMapKeys[i];
                if (results.length >= 30) {
                    break;
                }
                const formattedKey = key.replace(/[^a-zA-Z\d:]/g, '').toLowerCase();
                const indexFound = formattedKey.indexOf(formattedText);
                if (indexFound > -1) {
                    results.push({ article: articlesMap[key], indexFound: indexFound });
                }
            }

            const sortedResults = results.sort((a, b) => a.indexFound - b.indexFound).map((sortedResult) => sortedResult.article);
            setSearchResults(sortedResults);
        } else {
            setSearchResults([]);
        }
    };

    if (!fontsLoaded) {
        return <View style={styles.outerContainer} />;
    }

    return (
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
                />

                {searchResults.map((searchResult) => {
                    return <Text style={styles.listItem} key={searchResult.id}>{searchResult.title}</Text>
                })}

                <StatusBar style="auto" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        fontFamily: 'bender',
        color: '#9a8866',
        fontSize: 18,
        padding: 10,
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        maxWidth: 900,
        fontFamily: 'bender',
        color: '#9a8866',
        fontSize: 18
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

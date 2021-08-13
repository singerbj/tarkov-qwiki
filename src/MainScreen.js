import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Util from './Util';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from './AppContext';
import Article from './Article';
import GlobalStyle from './GlobalStyle';

// TODO: cache search results, get article data, make it work for mobile, remove textbox highlight, make http calls to wiki work on mobile
// images: https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/0/0a/Door_kicker_boonie_hat.png/ ???????

export default MainScreen = () => {
    const { articlesMap, refreshArticleData, search, searchResults, articlesLoaded, getArticleContent } = useContext(AppContext);
    const [searchText, setSearchText] = useState('');
    const [currentArticle, setCurrentArticle] = useState();
    const [currentArticleContent, setCurrentArticleContent] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refreshArticleData()
    }, []);

    const showArticle = async (article) => {
        if (!article) {
            setCurrentArticle();
            setCurrentArticleContent();
        } else {
            setLoading(true);
            try {
                const articleContent = await getArticleContent(article);
                setCurrentArticleContent(articleContent);
                if (articleContent.isRedirect) {
                    showArticle(articlesMap[articleContent.redirectTo.page]);
                } else {
                    setCurrentArticle(article.id);
                    setLoading(false);
                }
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
    };

    if (!articlesLoaded || loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.outerContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Escape from Tarkov Qwiki</Text>
                            {/* <Text style={styles.loadingMessage}>Loading...</Text> */}
                            <ActivityIndicator color="#9a8866" />
                        </View>
                    </View>
                    <StatusBar style="light" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    } else if (currentArticle) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.outerContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Escape from Tarkov Qwiki</Text>
                            <Article currentArticle={currentArticle} currentArticleContent={currentArticleContent} showArticle={showArticle} />
                        </View>
                    </View>
                    <StatusBar style="light" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    } else {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.outerContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Escape from Tarkov Qwiki</Text>
                            <View style={styles.searchBoxContainer}>
                                <TextInput
                                    style={styles.searchBox}
                                    onChangeText={(text) => {
                                        setSearchText(text);
                                        search(text.trim());
                                    }}
                                    value={searchText}
                                    placeholder={'search'}
                                    autoFocus={true}
                                    placeholderTextColor={'#9a8866'}
                                />
                            </View>
                            <View style={styles.searchResultsContainer}>
                                <ScrollView style={styles.searchResults}>
                                    {searchResults.map((searchResult) => {
                                        return (
                                            <Text
                                                style={styles.listItem} key={searchResult.id}
                                                onPress={() => {
                                                    if (currentArticle != searchResult.id) {
                                                        showArticle(searchResult)
                                                    }
                                                }}
                                            >
                                                {searchResult.title}
                                            </Text>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    <StatusBar style="light" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styleObject = {
    safeArea: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        width: '100%'
    },
    innerContainer: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 900,
        height: '100%'
    },
    searchBoxContainer: {
        width: '100%',
        height: 42,
    },
    searchBox: {
        height: '100%',
        width: '100%',
        borderColor: '#9a8866',
        borderWidth: 1,
        padding: 10,
    },
    searchResultsContainer: {
        width: '100%',
        position: 'absolute',
        top: 90,
        left: 0,
        height: '100%',
    },
    searchResults: {},
    listItem: {
        height: 40,
        width: '100%',
        padding: 10,
        borderColor: '#9a8866',
        borderWidth: 1,
        marginTop: 5,
    },
    loadingMessage: {},
    title: {
        fontFamily: 'bender-bold',
        marginBottom: 20
    }
};

if (Util.isElectron()) {
    styleObject.searchBox.placeholderTextColor = '#9a8866';
    styleObject.searchBox.outlineWidth = 0;
}

Object.keys(styleObject).forEach((key) => {
    styleObject[key] = {
        ...GlobalStyle,
        ...styleObject[key],
    };
});

const styles = StyleSheet.create(styleObject);

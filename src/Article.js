import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, ScrollView, Image, BackHandler, ViewPropTypes } from 'react-native';
import { AppContext } from './AppContext';
import GlobalStyle from './GlobalStyle';
import uuid from 'react-uuid';
import ApiHelper from './ApiHelper';
import { Table, Row, Rows } from 'react-native-table-component';


export default MainScreen = ({ currentArticleContent, showArticle }) => {
    console.log(currentArticleContent);

    const buildSectionJSX = (section) => {
        const jsxArray = [];
        const key = 1;

        if (section.title && Object.keys(section).length > 2) {
            jsxArray.push(<Text key={uuid()} style={styles.heading}>{section.title}</Text>);
        }
        if (section.paragraphs) {
            section.paragraphs.map((paragraph) => {
                return paragraph.sentences.map((sentence) => {
                    // if (sentence.links) {
                    //     console.log(sentence.links.filter((link) => link.wiki !== 'en' && link.wiki !== undefined));
                    // }
                    if (!sentence.links || !(sentence.links.filter((link) => link.wiki !== 'en' && link.wiki !== undefined).length > 0)) {
                        return sentence.text;
                    } else {
                        return '';
                    }
                }).join(' ');
            }).forEach((paragraph) => {
                paragraph = paragraph.replace(/(<.+>)|(\'\'\')/g, '').trim();
                if (paragraph && paragraph.length > 0) {
                    jsxArray.push(<Text key={uuid()} style={styles.paragraph}>{paragraph}</Text>);
                }
            });
        }
        if (section.lists) {
            section.lists.forEach((list) => {
                list.forEach((listItem) => {
                    jsxArray.push(<Text key={uuid()} style={styles.listItem}>• {listItem.text}</Text>)
                });
            });
        }
        if (section.infoboxes) {
            section.infoboxes.forEach((infobox) => {
                if (infobox.image || infobox.icon) {
                    jsxArray.push(
                        <View key={uuid()}>
                            <Image
                                style={styles.image}
                                source={{
                                    uri: ApiHelper.WIKI_IMG_FULL_URL + infobox.image.text,
                                }}
                            />
                            {infobox.icon &&
                                <Image
                                    style={styles.icon}
                                    source={{
                                        uri: ApiHelper.WIKI_IMG_FULL_URL + infobox.icon.text,
                                    }}
                                />
                            }
                        </View>
                    );
                }

                const tableArray = [];
                const infoboxKeys = Object.keys(infobox);
                infoboxKeys.forEach((key) => {
                    const useableKeys = ["type", "weight", "grid", "price", "effect", "use time", "loot xp", "exam xp"]
                    if (useableKeys.indexOf(key) > -1) {
                        tableArray.push(
                            <View key={uuid()} style={styles.tableRow}>
                                <Text style={styles.tableItemTitle}>{key}</Text>
                                <Text style={styles.tableItemValue}>{infobox[key].text}</Text>
                            </View>
                        );
                    }
                });

                jsxArray.push(
                    <View key={uuid()} style={styles.tableRow}>
                        {tableArray}
                    </View>
                );
            });
        }
        if (section.templates) {
            section.templates.forEach((template) => {
                if (template.template === 'gallery') {
                    template.images.forEach((image) => {
                        const formattedUrl = image.url.replace(/https:\/\/wikipedia.org/g, ApiHelper.WIKI_IMG_URL);
                        jsxArray.push(<Image
                            style={styles.image}
                            key={uuid()}
                            source={{
                                uri: formattedUrl,
                            }}
                        />);
                        if (image.caption) {
                            jsxArray.push(<Text key={uuid()} style={styles.tableItemTitle}>{image.caption.data.text}</Text>)
                        }
                    });
                } else if (template.template.indexOf('navbox') === 0) {

                }
            });
        }
        if (section.tables) {
            section.tables.forEach((table) => {
                let keys = Object.keys(table[0]);
                const startKeys = [];
                const endKeys = [];
                keys.forEach((key) => {
                    if (!isNaN(key)) {
                        endKeys.push(key);
                    } else {
                        startKeys.push(key);
                    }
                });
                keys = startKeys.concat(endKeys);
                const data = table.map((tableRow) => {
                    return keys.map((key) => tableRow[key].text);
                });
                const widthArr = keys.map((key) => {
                    if (key.length <= 1) {
                        return 50;
                    } else {
                        return 200;
                    }
                })
                jsxArray.push(
                    <ScrollView horizontal={true} style={styles.dataTableContainer} key={uuid()}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#9a8866' }} textStyle={{ ...GlobalStyle }} >
                            <Row style={styles.dataTableHead} data={keys} textStyle={{ ...GlobalStyle, padding: 10, fontFamily: 'bender-bold' }} widthArr={widthArr} />
                            <Rows style={styles.dataTableText} data={data} textStyle={{ ...GlobalStyle, padding: 10 }} widthArr={widthArr} />
                        </Table>
                    </ScrollView>
                );
            });
        }
        return jsxArray;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            showArticle();
            return true;
        });

        return () => backHandler.remove();
    }, []);

    return (
        <>
            <ScrollView style={styles.articleContainer}>
                <Text style={styles.title}>{currentArticleContent.title}</Text>
                {currentArticleContent.sections.map((section) => {
                    return buildSectionJSX(section);
                })}
                <Text style={styles.heading}>Categories</Text>
                <Text style={styles.categories}>{currentArticleContent.categories.join(', ')}</Text>
            </ScrollView>
            <TouchableOpacity
                onPress={() => showArticle()}
                style={styles.backButton}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </>
    );
}

// const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styleObject = {
    articleContainer: {
        width: '100%',
        height: windowHeight - 180
    },
    title: {
        fontSize: 32,
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'bender-bold',
    },
    categories: {
        marginBottom: 20
    },
    heading: {
        marginTop: 20,
        marginBottom: 10,
        fontFamily: 'bender-bold',
    },
    paragraph: {
        marginBottom: 20,
    },
    listItem: {
        marginLeft: 20
    },
    backButton: {
        height: 40,
        backgroundColor: '#9a8866',
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        width: '100%'
    },
    backButtonText: {
        backgroundColor: '#9a8866',
        color: '#000',
        textAlign: 'center'
    },
    image: {
        height: 150,
        resizeMode: 'contain',
        borderColor: '#9a8866',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 20
    },
    icon: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 75,
        width: 75,
        resizeMode: 'contain',
        marginTop: 30,
        marginRight: 10,
    },
    tableRow: {
        width: '100%'
    },
    tableItemTitle: {
        borderColor: '#9a8866',
        borderWidth: 1,
        padding: 10,
        marginBottom: 5,
        fontFamily: 'bender-bold',
        textAlign: 'center',
    },
    tableItemValue: {
        borderColor: '#9a8866',
        borderWidth: 1,
        padding: 10,
        marginBottom: 5
    },
    dataTableContainer: { marginBottom: 20 },
    dataTableHead: {},
    dataTableText: {}
};

// if (Util.isElectron()) {
//     styleObject.searchBox.placeholderTextColor = '#9a8866';
//     styleObject.searchBox.outlineWidth = 0;
// }

Object.keys(styleObject).forEach((key) => {
    styleObject[key] = {
        ...GlobalStyle,
        ...styleObject[key],
    };
});

delete styleObject.image.fontFamily;
delete styleObject.image.color;
delete styleObject.image.fontSize;
delete styleObject.icon.fontFamily;
delete styleObject.icon.color;
delete styleObject.icon.fontSize;

const styles = StyleSheet.create(styleObject);

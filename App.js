import React, { useEffect, useState } from 'react';
import MainScreen from './src/MainScreen';
import { AppContextWrapper } from './src/AppContext';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import Bender from './assets/fonts/Bender.otf';
import BenderBold from './assets/fonts/Bender.bold.otf';

export default App = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const loadFonts = async () => {
        await Font.loadAsync({
            'bender': {
                uri: Bender,
                display: Font.FontDisplay.SWAP,
            },
        });
        await Font.loadAsync({
            'bender-bold': {
                uri: BenderBold,
                display: Font.FontDisplay.SWAP,
            },
        });
        setFontsLoaded(true);
    }

    useEffect(() => {
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingView}>
                <Text>Loading...</Text>
            </View>
        );
    } else {
        return (
            <AppContextWrapper>
                <MainScreen />
            </AppContextWrapper>
        );
    }
}


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    loadingView: {
        backgroundColor: '#000',
        height: windowHeight,
        width: windowWidth,
    }
});

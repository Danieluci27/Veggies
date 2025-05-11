import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const filePath = `${FileSystem.documentDirectory}flash_card_set.json`;

export default function FlashCards () {
    // Destructure the parameters passed from the Questions screen
    const labelLists = useRef([]);
    const items = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startFlashCard, setStartFlashCard] = useState(false);
    const [component, setComponent] = useState(null);
    const [flip, setFlip] = useState(false);
    const currentItem = useRef([]);
    const [cardSet, setCardSet] = useState(false); 
    const navigation = useNavigation();

    const readJsonFile = async () => {
        try {
            const content = await FileSystem.readAsStringAsync(filePath);
            return JSON.parse(content);
        } catch (error) {
            console.error('Error reading JSON file:', error);
            return {}; // Return an empty object if reading fails
        }
    };
    const checkFileExists = async () => {
        try {
            const info = await FileSystem.getInfoAsync(filePath);
            return info.exists;
        } catch (error) {
            console.error('Error checking file existence:', error);
            return false;
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const fetchData = async () => {
                try {
                    const condition = await checkFileExists();
                    if (condition) {
                        items.current = await readJsonFile();
                        labelLists.current = Object.keys(items.current);
                        setStartFlashCard(true);

                    } else {
                        console.log('File cannot be found.');
                    }
                } catch (error) {
                    console.error('Error fetching file content:', error);
                }
            };
            fetchData();
        });
    
        // Cleanup when the component unmounts
        return unsubscribe;
      }, [navigation]);

    useEffect(() => {
        function handleComponent () {

            if (!flip) {
                return <TouchableOpacity onPress = {() => setFlip(true)}>
                <Image source={{uri: currentItem.current.imageUrl}} style={styles.image}/>
            </TouchableOpacity> 
            } else {
                return <View style={styles.container}>
                        <TouchableOpacity onPress = {() => setFlip(false)}>
                        <Text style={styles.text}>{currentItem.current.label}</Text>
                        </TouchableOpacity>
                        </View>
            }
        }
        console.log('is flip', flip);
        setComponent(handleComponent());
    },[flip])

    function Card () {
        console.log(component);
        if (cardSet) {
            return component;
           
        } else {
            return <Text style={styles.text}>Loading...</Text>
        }
    }

    useEffect (() => {
        if (startFlashCard) {
            console.log(currentIndex);
            console.log('1', startFlashCard);
            currentItem.current = {'imageUrl': items.current[labelLists.current[currentIndex]].imageUrl,
                                    'label': labelLists.current[currentIndex]};
            console.log(currentItem.current);
            setCardSet(true);
            setComponent(<TouchableOpacity onPress = {() => setFlip(true)}>
            <Image source={{uri: currentItem.current.imageUrl}} style={styles.image}/>
        </TouchableOpacity>);
        }
    }, [currentIndex, startFlashCard])

    const moveCard = () => {
        if (currentIndex === labelLists.current.length - 1) {
            setCurrentIndex(0); 
        }
        else {
            setCurrentIndex(currentIndex => currentIndex + 1);   
        }
        setCardSet(false);
        setFlip(false);
    }

    return (
        <View style={styles.container}>
            <Card/>
            <Button title='next' onPress={moveCard}> </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: 'bold', 
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
        borderRadius: 10,
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
});
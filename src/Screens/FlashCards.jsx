import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

//GET

//Remove == DELETE
//upload to local repositories, and save the local imageUris.
//if user saves the images obtained from online, download it and save it to local storage.

export default function FlashCards () {
    // Destructure the parameters passed from the Questions screen
    const [pics, setPics] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startFlashCard, setStartFlashCard] = useState(false);
    const [component, setComponent] = useState(null);
    const [flip, setFlip] = useState(false);
    const currentItem = useRef([]);
    const [cardSet, setCardSet] = useState(false); 
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const fetchData = async () => {
                try {
                    const database = await SQLite.openDatabaseAsync('pics');
                    await database.execAsync(`
                        PRAGMA journal_mode = WAL;
                        CREATE TABLE IF NOT EXISTS pics (id INTEGER PRIMARY KEY NOT NULL, label TEXT NOT NULL, uri TEXT NOT NULL);
                    `);
                    setPics(await database.getAllAsync('SELECT * FROM pics'));
                    console.log(pics);
                    setStartFlashCard(true);
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
            try {
                currentItem.current = {'imageUrl': pics[currentIndex].uri,
                                    'label': pics[currentIndex].label};
            } catch (error) {
                console.log(currentIndex, error);
                console.log(pics);
            }
            console.log(currentItem.current);
            setCardSet(true);
            setComponent(<TouchableOpacity onPress = {() => setFlip(true)}>
            <Image source={{uri: currentItem.current.imageUrl}} style={styles.image}/>
        </TouchableOpacity>);
        }
    }, [currentIndex, startFlashCard])

    const moveCard = () => {
        if (currentIndex >= pics.length - 1) {
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
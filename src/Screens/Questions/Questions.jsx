import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, Image, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchImageUrl from './Search';
import Modal from 'react-native-modal';
import * as SQLite from 'expo-sqlite';

export default function Questions({ route }) {
    const type = route.params?.message;
    const items = useRef([]); 
    const navigation = useNavigation();
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [usedItems, setusedItems] = useState([]);
    const [imageUrl, setImageUrl] = useState(''); 
    const additionalNote = useRef('');
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
    const [guessChecked, setGuessChecked] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [userGuess, setUserGuess] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log('ScreenB is focused');
          if (type === 'Veggies') {
            items.current = require('./questions_data/veggies.json');
          } else if (type === 'Fruits') {
            items.current = require('./questions_data/fruits.json');
          } else {
            alert('Cannot Load File');
          }
          pickRandomItem(items.current);
        });
    
        // Cleanup when the component unmounts
        return unsubscribe;
      }, [navigation]);
          
          
    const initiate = () => {
        setUserGuess('');
        setIsCorrect(false);
        console.log(usedItems);
        setGuessChecked(false);
        const filteredItems = Object.fromEntries(
                    Object.entries(items.current).filter(([key]) => !usedItems.includes(key)));
        pickRandomItem(filteredItems);
    };

    const pickRandomItem = (availableItems) => {
        const itemKeys = Object.keys(availableItems);
        if (itemKeys.length > 0 ) {
            const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            setCurrentItem({ label: randomKey, imageUrl: availableItems[randomKey] });
        } else {
            navigation.navigate('Results', {'correctAnswerCount': correctAnswerCount, 'totalItems': Object.keys(items.current).length});
            return; 
        } 
    };

    const checkGuess = async () => {
        setusedItems([...usedItems, currentItem.label]);
        setGuessChecked(true);
        if (userGuess.toLowerCase() === currentItem.label.toLowerCase()) {
            Alert.alert('Correct!', `You guessed it right! It's ${currentItem.label}.`);
            setIsCorrect(true);
            setCorrectAnswerCount(correctAnswerCount + 1);
        } else {
            Alert.alert('Incorrect', `Oops! It's ${currentItem.label}.`);
            SetImageUrl();
        }
    };

    if (!currentItem) {
        return <Text>Loading...</Text>;
    }

    function NextButton() {
        if (guessChecked) {
            const usedItems_length = Object.keys(usedItems).length;
            const items_length = Object.keys(items.current).length;
            if (usedItems_length === items_length) {
                console.log('last');
                return <Button title="See the Result" onPress={initiate} />;
            } else if (usedItems_length < items_length) {
                return <Button title="Next" onPress={initiate} />;
            }
        } else {
            return <Button title="Submit" onPress={checkGuess} />;
        }
    };

    function PopUpButton () {
        if (guessChecked && !isCorrect) {
            return <Button title='want to compare?' onPress={handleModal}></Button>;
        }
    }

    function SaveButton () {
        if (guessChecked && !isCorrect) {
            return <Button title='Save' onPress={handleSaveModal}></Button>;
        }
    }

const SaveToFlashCards = async () => {
    try {
        const database = await SQLite.openDatabaseAsync('pics');
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS pics (id INTEGER PRIMARY KEY NOT NULL, label TEXT, uri TEXT);
        `);
        const result = await database.runAsync("INSERT INTO pics (label, uri) VALUES (?, ?)", [
            currentItem.label,
            currentItem.imageUrl
        ]);
        console.log(result.lastInsertRowId, result.changes);
        console.log('Flashcard saved successfully!');
    } catch (error) {
        console.error('Error saving flashcard:', error);
    }
};
const Complete = async ({note}) => {
    handleSaveModal();
    additionalNote.current = note; 
    SaveToFlashCards();
};


    function SetImageUrl() {
            if (Object.keys(items.current).includes(userGuess.toLowerCase())) {
                setImageUrl(items.current[userGuess.toLowerCase()]);
            } else { (async () => {
                try {
                    console.log(userGuess);
                    const results = await SearchImageUrl(userGuess);
                    console.log(results);
                    const url = results['result'][0]["url"];
                    setImageUrl(url);
                } catch (error) {
                    console.error('Error fetching image URLs:', error);
                }
            })(); }
    }


    function ComparisonModal () {
        return <Modal isVisible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.container}>
            <Text>Hello!</Text>
            <Image source={{ uri: imageUrl }} style={styles.image}/>
            <Image source={{ uri: currentItem.imageUrl }} style={styles.image} />
            <Button title="Hide modal" onPress={handleModal} />
          </View>
        </Modal>
    }

    const SaveModal = () => {
            const [note, setNote] = useState(''); 
            return (
                <Modal
                    isVisible={isSaveModalVisible}
                    transparent={false}
                    onBackdropPress={handleSaveModal}>

                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <Image style={styles.image} source={{uri: currentItem.imageUrl}}> 

                        </Image>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your note"
                            value={note}
                            onChangeText={setNote}
                            autoFocus={true}
                        />
                        <Button title="Complete" onPress={() => Complete({note})} />
                    </KeyboardAvoidingView>
                </Modal>
            );
    };

    const handleModal = () => setIsModalVisible(() => !isModalVisible);
    const handleSaveModal = () => (setIsSaveModalVisible(() => !isSaveModalVisible));

    return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>Correct Answers: {correctAnswerCount}</Text>
                <Image source={{ uri: currentItem.imageUrl }} style={styles.image} />
                <TextInput
                    style={styles.input}
                    placeholder="Guess the vegetable"
                    value={userGuess}
                    onChangeText={(text) => setUserGuess(text)}
                />
                <PopUpButton/>
                <ComparisonModal/>
                <SaveModal/>
                <SaveButton/>
                <NextButton/>
            </SafeAreaView>
    );
}

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

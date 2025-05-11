import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Results ({ route }) {
    const navigation = useNavigation();
    // Destructure the parameters passed from the Questions screen
    const { correctAnswerCount, totalItems } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz Complete!</Text>
            <Text style={styles.resultText}>
                You answered {correctAnswerCount} out of {totalItems} questions correctly.
            </Text>
            <Text style={styles.resultText}>
                Your score: {((correctAnswerCount / totalItems) * 100).toFixed(2)}%
            </Text>
            <Button title="Return to Home" onPress = {() => navigation.navigate('Splash')}></Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
});

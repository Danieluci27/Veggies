import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';


export default function ImageButton(props) {
    return (
        <TouchableOpacity onPress = {props.onPress}>
            <View style={styles.button}>
                <Image source={{uri: props.uri}}
                        style={styles.image} />
                <Text styles={styles.text}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: '#f01d71',
    },

    image: {
        width: 100,
        height: 100, 
    },

    text: {
        color: 'black', 
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
        textAlign: 'center'
    }
})

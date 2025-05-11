import {SafeAreaView, TouchableOpacity, Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import { useNavigation } from '@react-navigation/native';


export default function Splash() {
    const navigation = useNavigation();
    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topPart}>
                    <HeaderText text='Improve'/>
                    <HeaderText text='Your Knowledge On'/>
                    <HeaderText text='Vegetables and Fruits'/>
                </View>

                <View style={styles.bottomPart}>
                    <View style={styles.gridContainer}>
                        <ImageButton backgroundColor={{ backgroundColor: '#4CAF50' }} 
                        source={require('./assets/veggies.png')} text='Veggies' onPress={() => navigation.navigate('Questions', {message: 'Veggies'})}/>

                        <ImageButton backgroundColor={{ backgroundColor: '#FF9800' }} 
                        source={require('./assets/fruits.png')} text='Fruits' onPress={() => navigation.navigate('Questions', {message: 'Fruits'})}/>

                        <ImageButton backgroundColor={{ backgroundColor: '#3F51B5' }} 
                        source={require('./assets/upload.jpg')} text='Cards' onPress={() => navigation.navigate('FlashCards')} />

                        <ImageButton backgroundColor={{ backgroundColor: '#00695C' }} 
                        source={require('./assets/explore.jpg')} text='Explore'/>
                    </View>
                </View>
        </SafeAreaView>

       
    );
};

function ImageButton(props) {
    return (
        <TouchableOpacity onPress = {props.onPress} style={[styles.card, props.backgroundColor]}>
                <View>
                    <Text style={styles.cardText}>{props.text}</Text>
                    <Image source={props.source}
                      style={styles.icon} />
                </View>
        </TouchableOpacity>
    );
};

function HeaderText(props) {
    return (
        <Text style={styles.headerText}>
                    {props.text}
                    </Text>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    topPart: {
      flex: 1.0, // Top part takes 1/3 of the screen
      justifyContent: 'center', // Centers content vertically
      alignItems: 'left', // Centers content horizontally
      paddingTop: 80,
    },
    headerText: {
      fontSize: 40,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    bottomPart: {
      flex: 1.9, // Bottom part takes 2/3 of the screen
      justifyContent: 'flex-start', // Centers gridContainer vertically
      alignItems: 'center',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between', // Spreads cards evenly horizontally
      width: '100%', // Ensures the grid spans the width of the screen
      paddingHorizontal: 20, // Adds spacing on the sides
    },
    card: {
      width: '46%',
      aspectRatio: 1.1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      marginBottom: 20,
    },
    cardText: {
      color: '#FFFFFF',
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 10,
      textAlign: 'center',
    },
    icon: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      opacity: 0.8,
    },
  });
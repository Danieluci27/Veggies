// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Questions from '../Screens/Questions/Questions';
import Splash from '../Screens/Splash';
import Results from '../Screens/Results';
import FlashCards from '../Screens/FlashCards';

const RootStack = createNativeStackNavigator({
  screens: {
    Splash: Splash,
    Questions: Questions,
    Results: Results,
    FlashCards: FlashCards,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function AppNagivator() {
  return <Navigation />;
}
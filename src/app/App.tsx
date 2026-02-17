import React from 'react';
import RootNavigator from '../navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

export default function App() {
  return <NavigationContainer>
    <StatusBar
      barStyle="dark-content"
      backgroundColor="#ffffff"
    />
    <RootNavigator />
  </NavigationContainer>;
}
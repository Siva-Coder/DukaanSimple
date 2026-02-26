import React from 'react';
import RootNavigator from '../navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../theme/themeContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#ffffff"
            />
            <BottomSheetModalProvider>
              <RootNavigator />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
};
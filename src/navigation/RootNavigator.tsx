import React, { useEffect } from 'react';
import AuthStack from './AuthStack';
import { initAuthListener, useAuthStore } from '../store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';
import RootStack from './RootStack';

export default function RootNavigator() {
  const { user, initializing } = useAuthStore();

  useEffect(() => {
    console.log(initAuthListener());
    
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <RootStack /> : <AuthStack />;
}
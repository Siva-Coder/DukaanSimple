import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function Shimmer({
  width = '100%',
  height = 80,
  borderRadius = 10,
}: any) {
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius },
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['#eeeeee', '#dddddd', '#eeeeee']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
    marginBottom: 15,
  },
  shimmer: {
    width: '50%',
    height: '100%',
  },
});
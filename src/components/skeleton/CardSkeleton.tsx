import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from 'react-native';

export default function CardSkeleton() {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <View style={{ marginBottom: 15 }}>
        <View style={{ width: '100%', height: 80 }} />
      </View>
    </SkeletonPlaceholder>
  );
}
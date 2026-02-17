import React from 'react';
import { View } from 'react-native';
import Shimmer from '../common/Shimmer';

export default function ListSkeleton() {
  return (
    <View style={{ padding: 16 }}>
      {[1, 2, 3, 4].map(i => (
        <Shimmer key={i} height={70} />
      ))}
    </View>
  );
};
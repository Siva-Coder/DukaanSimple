import React from 'react';
import { View } from 'react-native';
import Shimmer from '../common/Shimmer';

export default function DashboardSkeleton() {
  return (
    <View style={{ padding: 16 }}>
      <Shimmer height={30} width="50%" />
      <Shimmer height={100} />
      <Shimmer height={100} />
      <Shimmer height={150} />
    </View>
  );
}
import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet from '@gorhom/bottom-sheet';
import AppBottomSheet from '../common/AppBottomSheet';
import { useTheme } from '../../theme/themeContext';
import { colors } from '../../theme/colors';

interface Props {
  onNavigate: (route: string) => void;
}

const QuickAddSheet: React.FC<Props> = ({ onNavigate }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const { primary } = useTheme();

  const open = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const handlePress = useCallback(
    (route: string) => {
      close();
      setTimeout(() => onNavigate(route), 200);
    },
    [close, onNavigate]
  );

  return (
    <>
      <AppBottomSheet ref={sheetRef} snap="35%">
        <Text style={styles.title}>Quick Create</Text>

        <View style={styles.grid}>
          <Action icon="receipt-outline" label="Sale" onPress={() => handlePress('CreateSale')} />
          <Action icon="cart-outline" label="Purchase" onPress={() => handlePress('CreatePurchase')} />
          <Action icon="person-add-outline" label="Customer" onPress={() => handlePress('AddCustomer')} />
          <Action icon="business-outline" label="Supplier" onPress={() => handlePress('AddSupplier')} />
          <Action icon="cube-outline" label="Product" onPress={() => handlePress('AddProduct')} />
        </View>
      </AppBottomSheet>

      {/* expose open function */}
      <QuickAddSheetTrigger open={open} />
    </>
  );
};

const QuickAddSheetTrigger = React.memo(({ open }: any) => null);

const Action = React.memo(({ icon, label, onPress }: any) => {
  const { primary } = useTheme();

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={20} color={primary} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
});

export default React.memo(QuickAddSheet);

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  item: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});
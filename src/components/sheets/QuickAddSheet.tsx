import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

const QuickAddSheet: React.FC<Props> = ({
  visible,
  onClose,
  onNavigate,
}) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  if (!visible) return null;

  const handlePress = (route: string) => {
    onClose();
    setTimeout(() => {
      onNavigate(route);
    }, 250);
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheetContainer,
          { transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.title}>Quick Create</Text>

        <View style={styles.grid}>
          <ActionItem
            icon="receipt-outline"
            label="Sale"
            onPress={() => handlePress('CreateSale')}
          />
          <ActionItem
            icon="cart-outline"
            label="Purchase"
            onPress={() => handlePress('CreatePurchase')}
          />
          <ActionItem
            icon="person-add-outline"
            label="Customer"
            onPress={() => handlePress('AddCustomer')}
          />
          <ActionItem
            icon="business-outline"
            label="Supplier"
            onPress={() => handlePress('AddSupplier')}
          />
          <ActionItem
            icon="cube-outline"
            label="Product"
            onPress={() => handlePress('AddProduct')}
          />
        </View>
      </Animated.View>
    </View>
  );
};

interface ActionProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const ActionItem = React.memo(
  ({ icon, label, onPress }: ActionProps) => {
    return (
      <TouchableOpacity
        style={styles.actionItem}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    );
  }
);

export default React.memo(QuickAddSheet);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});
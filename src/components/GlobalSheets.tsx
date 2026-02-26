import React, {
  useRef,
  useMemo,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/themeContext';

type SheetContextType = {
  openQuick: () => void;
  openBills: () => void;
  closeAll: () => void;
};

const SheetContext = createContext<SheetContextType | null>(null);

export const useGlobalSheets = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('useGlobalSheets must be used within GlobalSheetsProvider');
  }
  return context;
};

export const GlobalSheetsProvider = ({ children }: any) => {
  const quickRef = useRef<BottomSheetModal>(null);
  const billsRef = useRef<BottomSheetModal>(null);
  const { theme } = useTheme();

  const quickSnapPoints = useMemo(() => ['38%'], []);
  const billsSnapPoints = useMemo(() => ['40%'], []);

  const openQuick = useCallback(() => {
    quickRef.current?.present();
  }, []);

  const openBills = useCallback(() => {
    billsRef.current?.present();
  }, []);

  const closeAll = useCallback(() => {
    quickRef.current?.dismiss();
    billsRef.current?.dismiss();
  }, []);

  return (
    <SheetContext.Provider value={{ openQuick, openBills, closeAll }}>
      {children}

      <BottomSheetModal
        ref={quickRef}
        snapPoints={quickSnapPoints}
        enablePanDownToClose
      >
        <QuickContent theme={theme} />
      </BottomSheetModal>

      <BottomSheetModal
        ref={billsRef}
        snapPoints={billsSnapPoints}
        enablePanDownToClose
      >
        <BillsContent theme={theme} />
      </BottomSheetModal>
    </SheetContext.Provider>
  );
};

/* ---------- CONTENT COMPONENTS ---------- */

const QuickContent = ({ theme }: any) => (
  <View style={styles.container}>
    <Text style={styles.title}>Quick Create</Text>
  </View>
);

const BillsContent = ({ theme }: any) => (
  <View style={styles.container}>
    <Text style={styles.title}>Transactions</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
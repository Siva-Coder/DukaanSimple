import React, { useMemo, useCallback, forwardRef } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface Props {
  children: React.ReactNode;
  snap?: string;
}

const AppBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ children, snap = '40%' }, ref) => {
    const snapPoints = useMemo(() => [snap], [snap]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.25}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        // index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        {children}
      </BottomSheetModal>
    );
  }
);

export default React.memo(AppBottomSheet);

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: '#CBD5E1',
    width: 40,
  },
});
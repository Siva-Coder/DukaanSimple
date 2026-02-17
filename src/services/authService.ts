import auth, {
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';

/**
 * Send OTP
 */
export const sendOTP = async (
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    throw error;
  }
};

/**
 * Confirm OTP
 */
export const confirmOTP = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.User> => {
  try {
    const result = await confirmation.confirm(code);
    if (!result) {
      throw new Error('Failed to confirm OTP');
    }
    return result.user;
  } catch (error: any) {
    console.error('Confirm OTP Error:', error);
    throw error;
  }
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  await auth().signOut();
};

/**
 * Current user
 */
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthChanges = (
  callback: (user: FirebaseAuthTypes.User | null) => void
) => {
  return auth().onAuthStateChanged(callback);
};
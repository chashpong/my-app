import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDjsoTL5c5sEJB4rKPMPeRtojU1XD8OHXo",
  authDomain: "clearplannerapp.firebaseapp.com",
  projectId: "clearplannerapp",
  storageBucket: "clearplannerapp.appspot.com",
  messagingSenderId: "522676445747",
  appId: "1:522676445747:web:760360eb2d954793c2b946",
  measurementId: "G-YWGNKBQEKV"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✨ เปลี่ยนจาก getAuth(app) → initializeAuth(app, { persistence })
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

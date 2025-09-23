import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_Dt1smPotUGlNES3zqtjSO0qL_0nvca8",
  authDomain: "kmrl-71005.firebaseapp.com",
  projectId: "kmrl-71005",
  storageBucket: "kmrl-71005.firebasestorage.app",
  messagingSenderId: "726400021308",
  appId: "1:726400021308:web:42ba4dacd11763bea26439",
  measurementId: "G-58D9Y28MGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

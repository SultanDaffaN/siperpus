import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnLmcDVqFmFa24wWUlX3x8PnyCaf30A0c",
  authDomain: "siperpus-file.firebaseapp.com",
  projectId: "siperpus-file",
  storageBucket: "siperpus-file.appspot.com",
  messagingSenderId: "1001299026611",
  appId: "1:1001299026611:web:798b8e9622d28c271146c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage, app };
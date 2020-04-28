// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    projectId: process.env.VUE_APP_FIREBASE_DB_URL,
    storageBucket: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID
  };

  
  // Initialize Firebase

firebase.initializeApp(firebaseConfig);

firebase.auth().useDeviceLanguage();

export default firebase ; 
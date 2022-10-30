// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaZhKWD2iWoVNfL-PYft1IcClNpCcqTfQ",
  authDomain: "my-shopping-list-c2114.firebaseapp.com",
  databaseURL: "https://my-shopping-list-c2114-default-rtdb.firebaseio.com",
  projectId: "my-shopping-list-c2114",
  storageBucket: "my-shopping-list-c2114.appspot.com",
  messagingSenderId: "9949556645",
  appId: "1:9949556645:web:6ce539d7faf4494b17024c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
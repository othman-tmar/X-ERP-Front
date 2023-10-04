import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Initialize Firebase
const app = initializeApp ({
    apiKey: "AIzaSyBNsc2XjC7zmedOqKTj_AVBWRx9EWk5Zd8",
    authDomain: "esps-mern.firebaseapp.com",
    projectId: "esps-mern",
    storageBucket: "esps-mern.appspot.com",
    messagingSenderId: "423683567207",
    appId: "1:423683567207:web:cbff5db3de6d8733276ec2",
    measurementId: "G-EQEX89CF1D"
});
// Firebase storage reference
const storage = getStorage(app);
export default storage;
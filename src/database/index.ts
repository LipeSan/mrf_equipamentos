import firebase from 'firebase';
import 'firebase/storage';
import 'firebase/firestore'
import {firebaseConfig} from '../config/firebase';

//Set Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
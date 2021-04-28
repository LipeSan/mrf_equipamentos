import firebaseAdmin from 'firebase-admin';
const firebaseAdminConfig =  require('../config/firebaseAdmin.json');
import {firebaseConfig} from '../config/firebase';

//Set Firebase
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseAdminConfig),
    databaseURL: firebaseConfig.databaseURL
})

export default firebaseAdmin;
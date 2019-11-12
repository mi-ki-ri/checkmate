import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyDtLjiJ65pty1eKIFGVEm6mrXjkwaN9OUw",
  authDomain: "checkmate-90019.firebaseapp.com",
  databaseURL: "https://checkmate-90019.firebaseio.com",
  projectId: "checkmate-90019",
  storageBucket: "checkmate-90019.appspot.com",
  messagingSenderId: "330712329875",
  appId: "1:330712329875:web:daabb07e756386d99aa766",
  measurementId: "G-CYHXQ6QWGD"
};


if(firebase.apps.length < 1){
    firebase.initializeApp(firebaseConfig)
}

export default firebase
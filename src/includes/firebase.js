import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  //how will be able to connecto to Firebase. It let Firebase know that
  //we're the ones sending the request and not some other application
  apiKey: 'AIzaSyARMDOhvPU1dso9l41Oe8YZ4k9C8tyrntc',
  //url to send the authentication information
  authDomain: 'music-f8b43.firebaseapp.com',
  projectId: 'music-f8b43',
  //the bucket describes the location where the files are stored
  storageBucket: 'music-f8b43.appspot.com',
  //the sender ID is a feature for firebase to use push notifications between
  //applications instantly
  messagingSenderId: '289932487036',
  //firebase allows for multiple apps to be connected to a project
  //ths is the unique ID for this web app
  appId: '1:289932487036:web:55e7a0e8f46f09057b1cf9'
}

//Initialize Firebase
firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export { auth, db, usersCollection, storage, songsCollection, commentsCollection }

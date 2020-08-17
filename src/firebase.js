

import firebase from "firebase"
const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyC5zByXO0lm3n9eFJV4Kow1qZCiT8Hl240",
    authDomain: "instaclone-60235.firebaseapp.com",
    databaseURL: "https://instaclone-60235.firebaseio.com",
    projectId: "instaclone-60235",
    storageBucket: "instaclone-60235.appspot.com",
    messagingSenderId: "812077269805",
    appId: "1:812077269805:web:4c4fc20a7dbeaa783749a4",
    measurementId: "G-Q2E2901YSE"
})

const db=firebaseApp.firestore()
const auth=firebase.auth()
const storage=firebase.storage()
export {db, auth, storage}

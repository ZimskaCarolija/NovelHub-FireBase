const firebaseConfig = {
    apiKey: "AIzaSyAanQlvjydCgrcCGZc1ibN7dez2idWrsQw",
    authDomain: "novele-92092.firebaseapp.com",
    projectId: "novele-92092",
    storageBucket: "novele-92092.appspot.com",
    messagingSenderId: "823865860713",
    appId: "1:823865860713:web:6ad83863bb2c5091d538f8",
    measurementId: "G-99ZX23FDFM"
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebaseApp.auth();
export const db = firebaseApp.firestore();
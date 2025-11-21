// simpan di head html
//    <script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"></script>
//   <script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore-compat.js"></script>
 
 
 const firebaseConfig = {
    apiKey: "AIzaSyClAjQVFelOa9UcRKhwgYvoHkDyhQ0tvkM",
    authDomain: "absensi-sholat.firebaseapp.com",
    projectId: "absensi-sholat",
    storageBucket: "absensi-sholat.firebasestorage.app",
    messagingSenderId: "1003312770716",
    appId: "1:1003312770716:web:5ee8515f631c6d5d174759",
    measurementId: "G-7EXTXQ6CFT",

  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

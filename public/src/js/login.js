import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

   const firebaseConfig = {
    apiKey: "AIzaSyClAjQVFelOa9UcRKhwgYvoHkDyhQ0tvkM",
    authDomain: "absensi-sholat.firebaseapp.com",
    projectId: "absensi-sholat",
    storageBucket: "absensi-sholat.firebasestorage.app",
    messagingSenderId: "1003312770716",
    appId: "1:1003312770716:web:5ee8515f631c6d5d174759",
    measurementId: "G-7EXTXQ6CFT"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const namaInput = document.getElementById("nama").value.trim().toLowerCase();
    const nisInput = document.getElementById("nis").value.trim();

    try {
      const siswaRef = doc(db, "siswa", nisInput);
      const siswaSnap = await getDoc(siswaRef);

      if (siswaSnap.exists()) {
        const data = siswaSnap.data();
        const namaDatabase = data.nama.trim().toLowerCase();
        if (namaInput === namaDatabase) {
            // ✅ Simpan ke localStorage (kebutuhan identitas)
            localStorage.setItem("siswa", JSON.stringify({
          nama: data.nama,
          nis: nisInput
        }));


          window.location.href = "dashboard.html"; // ganti sesuai kebutuhan
        } else {
          alert("Nama tidak ditemukan!");
        }
      } else {
        alert("NIS tidak ditemukan!");
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("Terjadi kesalahan saat login.");
    }
  });
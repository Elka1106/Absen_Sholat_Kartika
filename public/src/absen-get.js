document.getElementById('absenForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  showLoading();

  // Ambil nis dari localStorage
  const siswa = JSON.parse(localStorage.getItem("siswa"));
  if (!siswa || !siswa.nis) {
    alert("NIS tidak ditemukan, silakan login dulu.");
    hideLoading();
    return;
  }
  const nis = siswa.nis;  // ambil NIS dari localStorage

  const status = document.getElementById('status').value;
  const tokenInput = document.getElementById('token').value.trim();

  // sisa kode tetap sama...
  const tanggal = new Date();
  const formattedTanggal = `${tanggal.getDate().toString().padStart(2, '0')}-${(tanggal.getMonth() + 1).toString().padStart(2, '0')}-${tanggal.getFullYear()}`;

  const imageBase64 = ambilGambarButton(); 

  // ✅ 1. Cek token
  const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
const formattedDate = `${day}-${month}-${year}`;

const tokenDoc = await db.collection("token_absen").doc(formattedDate).get();


  if (!tokenDoc.exists) {
    alert("Token tidak tersedia. Hubungi Guru.");
    hideLoading();
    return;
  }

  const validToken = tokenDoc.data().token; // token sah disimpan di Firestore
  if (tokenInput !== validToken) {
    alert("Token salah! Absen dibatalkan.");
    hideLoading();
    return;
  }

  // ✅ 2. Cek lokasi
  if (!navigator.geolocation) {
    alert("Browser tidak mendukung lokasi!");
    hideLoading();
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const lokasi = `https://www.google.com/maps?q=${latitude},${longitude}`;

    try {
      document.getElementById("preview").src = imageBase64;

      const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dqoo5xojd/image/upload";
      const uploadPreset = "absenImage";

      const formData = new FormData();
      formData.append("file", imageBase64);
      formData.append("upload_preset", uploadPreset);

      const uploadResponse = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData
      });

      if (!uploadResponse.ok) throw new Error("Gagal upload gambar ke Cloudinary");

      const cloudinaryData = await uploadResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      const siswaDoc = await db.collection("siswa").doc(String(nis)).get();

      if (!siswaDoc.exists) {
        alert("Siswa tidak ditemukan!");
        return;
      }

      const siswaData = siswaDoc.data();

      await db.collection("absen").doc(`${formattedTanggal}_${nis}`).set({
        siswaNis: nis,
        nama: siswaData.nama,
        kelas: siswaData.kelas,
        tanggal: formattedTanggal,
        lokasi: lokasi,
        status: status,
        foto: imageUrl,
        token: tokenInput
      });

      alert("Absen berhasil dikirim!");
      document.getElementById('absenForm').reset();
    } catch (err) {
      console.error("Gagal absen:", err);
      alert("Gagal mengirim absen.");
    } finally {
      hideLoading();
    }
  }, (error) => {
    alert("Gagal mengambil lokasi: " + error.message);
    hideLoading();
  });
});

  window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");
    const ambilGambarButton = document.getElementById("ambilGambarButton");
    const submitButton = document.getElementById("submitButton");
    const form = document.getElementById("absenForm");

    // Aktifkan kamera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        alert("Gagal mengakses kamera: " + err);
        console.error(err);
      });

    // Ambil gambar saat tombol diklik
    ambilGambarButton.addEventListener("click", () => {
      const context = canvas.getContext("2d");

      // Samakan dimensi canvas dengan video asli
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Gambar ke canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Ambil data URL dari canvas
      const imageDataUrl = canvas.toDataURL("image/png");

      // Sinkronisasi ukuran preview dengan elemen video di layar
      const videoDisplayWidth = video.offsetWidth;
      const videoDisplayHeight = video.offsetHeight;

      preview.src = imageDataUrl;
      preview.style.display = "block";
      preview.style.width = videoDisplayWidth + "px";
      preview.style.height = videoDisplayHeight + "px";
      preview.style.objectFit = "cover";
      preview.style.transform = "scaleX(-1)"; // mirror effect

      submitButton.style.display = "block";
    });

    // Kirim data absensi ke Firebase
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = document.getElementById("token").value.trim();
      const status = document.getElementById("status").value;
      const imageData = preview.src;

      if (!token) {
        alert("Token harus diisi.");
        return;
      }

      try {
        const timestamp = new Date().toLocaleString("id-ID");
        await firebase.firestore().collection("absensi").add({
          token,
          status,
          gambar: imageData,
          waktu: timestamp
        });

        alert("Absen berhasil dikirim.");
        form.reset();
        preview.style.display = "none";
        submitButton.style.display = "none";
      } catch (err) {
        console.error("Gagal menyimpan absen:", err);
        alert("Gagal menyimpan absen.");
      }
    });
  });
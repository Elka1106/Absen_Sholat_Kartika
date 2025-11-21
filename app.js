const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// ...existing code...
app.use(express.static(path.join(__dirname, "public")));
// ...existing code...

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

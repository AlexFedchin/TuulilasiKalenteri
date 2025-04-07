const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;

// Serve frontend (in production)
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

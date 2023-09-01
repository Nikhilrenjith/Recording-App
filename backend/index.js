const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

mongoose
  .connect(
    "mongodb+srv://nikhilrenjith4:database123@cluster.ronsoxv.mongodb.net/Users",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
app.use("/api/users", authRoutes);
app.get("/", (req, res) => {
  res.send({
    message: "API is working fine",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

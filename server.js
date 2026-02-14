const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000; 

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://shopora-frontend-tau.vercel.app"
    ],
    credentials: true
}));

app.use("/images", express.static("public/images"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected to Atlas");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));
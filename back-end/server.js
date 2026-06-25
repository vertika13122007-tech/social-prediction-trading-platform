require("dotenv").config();

const express = require('express');
const connectDB = require("./db/config");
const authRoutes = require("./src/routes/authroute");
const walletRoute = require("./src/routes/walletroute");
const marketRoute = require("./src/routes/marketRoute");
const tradeRoutes = require("./src/routes/tradeRoute");
const portfolioRoute = require("./src/routes/portfolioRoute");

const app = express();

connectDB();

const User = require("./db/schemas/User");

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/wallet",walletRoute);
app.use("/api/markets",marketRoute);
app.use("/api/trades",tradeRoutes);
app.use("/api/portfolio",portfolioRoute);

app.get("/",(req,resp) => {
    resp.send("Backend is working...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
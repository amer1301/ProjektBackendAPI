const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');

dotenv.config();

const app = express();


app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(express.json());

// Anslut till MongoDB med async/await
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

connectToDatabase();

app.get('/', (req, res) => {
    res.send('Välkommen till backend-servern!');
    });

// API-rutter
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Starta servern
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
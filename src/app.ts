import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get("/", (req, res) => {
    res.json({
        message: "Blog API calisiyor",
        version: "1.0.0"
    })
})

app.use((req, res) => {
    res.status(404).json({
        error: "Böyle bir sayfa bulunamadi"
    })
})

export default app;
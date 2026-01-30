import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "Blog API calisiyor",
        version: "1.0.0"
    })
})

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'})
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something went wrong"
    })
})
export default app;
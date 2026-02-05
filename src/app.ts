import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import commentRoutes from "./routes/comment";

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    
    // Don't log expected body-parser errors
    if (status >= 500) {
        console.error(err.stack);
    }
    
    res.status(status).json({
        error: status >= 500 ? "Something went wrong" : err.message
    })
})
export default app;
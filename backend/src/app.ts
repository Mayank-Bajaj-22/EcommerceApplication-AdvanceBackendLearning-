import express, { Request, Response } from "express";
import cors from "cors";
import { FRONTEND_URL } from "./config/env.config.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser());

app.get('/health-check', (req: Request, res: Response) => {
    return res.status(200).send({
        success: true,
        message: "Api is working fine",
    });
});
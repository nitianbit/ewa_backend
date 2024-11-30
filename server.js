import express from 'express'
const app = express();

import dotenv from 'dotenv';
import path from 'path'
import cors from 'cors'

import { CONFIG } from './src/config/config.js';
import settings from './settings.js';
import { connectDB } from './src/db/index.js';
import authRouter from "./src/modules/auth/routes.js"



dotenv.config({ path: path.resolve(settings.PROJECT_DIR, `.env`) });

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// app.use("/", routes)

app.use("/api", authRouter)
app.use("/", (req, res) => {
    res.send("Welcome to the server!");
});

connectDB()

app.listen(CONFIG.PORT, () => console.log(`Server running on port ${CONFIG.PORT}`))


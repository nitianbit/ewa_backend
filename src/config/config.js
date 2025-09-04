import dotenv from 'dotenv';
import settings from '../../settings.js';
import path from 'path'

dotenv.config({ path: path.resolve(settings.PROJECT_DIR, `.env`) });

export const CONFIG = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SMTP2GO_API_KEY: process.env.SMTP2GO_API_KEY,
};


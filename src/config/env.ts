import dotenv from 'dotenv';
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined in .env');
}

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const PORT = process.env.PORT || '3000';
export const GUARD_MESSAGE_FILENAME = 'guard-system-message.md';

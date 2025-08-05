import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

let db: any;

export async function initDb() {
    db = await open({
        filename: './chat.db',
        driver: sqlite3.Database,
    });
    await db.exec(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      role TEXT,
      content TEXT,
      mode TEXT,
      created_at DATE
    );

    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        level TEXT NOT NULL,
        dateConsentResearch DATE,
        dateConsentOpenAI DATE,
        "group" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS question (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        type TEXT NOT NULL,
        page TEXT NOT NULL,
        level TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS answer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        questionId INTEGER,
        FOREIGN KEY(questionId) REFERENCES question(id)
    );

    CREATE TABLE IF NOT EXISTS user_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        questionId INTEGER,
        page TEXT,
        answer TEXT,
        createdAt DATE,
        FOREIGN KEY(userId) REFERENCES user(id),
        FOREIGN KEY(questionId) REFERENCES question(id)
    );

    CREATE TABLE IF NOT EXISTS user_progress (
        userId INTEGER PRIMARY KEY,
        state TEXT,
        updatedAt DATE,
        FOREIGN KEY(userId) REFERENCES user(id)
    );
    `);
    return db;
}

export default {
    prepare: (...args: any[]) => db.prepare(...args),
    all: (...args: any[]) => db.all(...args),
};

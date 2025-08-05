import { Group, Level, TestPhase, User } from '../types/database.types';
import db from '../utils/db';

export async function getUserFromEmail(email: string): Promise<User | null> {
    const row = await db.all(`SELECT * FROM user WHERE email = ?`, [email]);
    return row.length ? new User(row[0]) : null;
}

export async function saveUser(email: string, level: Level): Promise<void> {
    // Alternate group assignment
    const countRow = await db.all('SELECT COUNT(*) as count FROM user');
    const count = countRow[0]?.count || 0;
    const group: Group = count % 2 === 0 ? 'test' : 'control';
    const stmt = await db.prepare(
        `INSERT INTO user (email, level, dateConsentResearch, dateConsentOpenAI, "group") VALUES (?, ?, ?, ?, ?)`
    );
    await stmt.run(email, level, new Date(), new Date(), group);
}

export async function getUserStudyState(email: string): Promise<TestPhase | 'none'> {
    const userRow = await db.all(`SELECT id FROM user WHERE email = ?`, [email]);
    if (!userRow.length) return 'none';
    const userId = userRow[0].id;
    // Check user_progress table first
    const progress = await db.all(`SELECT state FROM user_progress WHERE userId = ?`, [userId]);
    if (progress.length && progress[0].state) return progress[0].state;
    // Fallback: infer from answers if no progress row
    return 'none';
}

export async function setUserStudyState(email: string, state: TestPhase): Promise<void> {
    const userRow = await db.all(`SELECT id FROM user WHERE email = ?`, [email]);
    if (!userRow.length) throw new Error('Utilisateur non trouvé');
    const userId = userRow[0].id;
    await db
        .prepare(
            `INSERT INTO user_progress (userId, state, updatedAt) VALUES (?, ?, ?)
         ON CONFLICT(userId) DO UPDATE SET state = excluded.state, updatedAt = excluded.updatedAt`,
        )
        .then((stmt: any) => stmt.run(userId, state, new Date()));
}

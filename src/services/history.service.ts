import { ChatCompletionInput, ChatMessage } from '../types/chat.types';
import db from '../utils/db';

export async function saveMessage(
    sessionId: string,
    role: ChatMessage['role'],
    content: string,
    mode?: string,
): Promise<void> {
    const stmt = await db.prepare(
        'INSERT INTO chat_history (session_id, role, content, mode, created_at) VALUES (?, ?, ?, ?, ?);',
    );
    await stmt.run(sessionId, role, content, mode || null, new Date());
    await stmt.finalize();
}

export async function fetchHistoryBySession(sessionId: string): Promise<ChatCompletionInput[]> {
    const rows: ChatMessage[] = await db.all(
        'SELECT * FROM chat_history WHERE session_id = ? ORDER BY created_at ASC;',
        sessionId,
    );

    return rows.map(({ role, content }) => ({ role, content }));
}

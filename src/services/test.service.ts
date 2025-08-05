import { Answer, Question } from '../types/database.types';
import db from '../utils/db';
import { setUserStudyState } from './user.service';

export async function getQuestionsWithAnswers(page: 'pre-test' | 'post-test'): Promise<Question[]> {
    // 1. Fetch questions for given page
    const questionRows = await db.all(
        `SELECT id, text, type, page, level FROM question WHERE page = ?`,
        [page],
    );

    if (!questionRows.length) return [];

    const questionIds = questionRows.map((q: any) => q.id);

    // 2. Fetch all answers in one query
    const answerRows = await db.all(
        `SELECT id, text, questionId FROM answer WHERE questionId IN (${questionIds
            .map(() => '?')
            .join(',')})`,
        questionIds,
    );

    // 3. Group answers by questionId
    const answersByQuestionId = new Map<number, Answer[]>();
    for (const row of answerRows) {
        const answer = new Answer({
            id: row.id,
            text: row.text,
            questionId: row.questionId,
        });

        if (!answersByQuestionId.has(row.questionId)) {
            answersByQuestionId.set(row.questionId, []);
        }
        answersByQuestionId.get(row.questionId)!.push(answer);
    }

    // 4. Instantiate each question
    return questionRows.map(
        (row: any) =>
            new Question({
                id: row.id,
                text: row.text,
                type: row.type,
                page: row.page,
                level: row.level,
                answers: answersByQuestionId.get(row.id) || null,
            }),
    );
}

export async function saveUserAnswers(
    email: string,
    page: 'pre-test' | 'post-test',
    answers: { questionId: number; answer: string | number }[],
): Promise<void> {
    // Ensure user exists
    const userRow = await db.all(`SELECT id FROM user WHERE email = ?`, [email]);
    if (!userRow.length) throw new Error('Utilisateur non trouvé');
    const userId = userRow[0].id;

    // Insert answers
    const stmt = await db.prepare(
        `INSERT INTO user_answers (userId, questionId, page, answer, createdAt) VALUES (?, ?, ?, ?, ?)`,
    );
    for (const a of answers) {
        await stmt.run(userId, a.questionId, page, String(a.answer), new Date());
    }
    await stmt.finalize();
    // If pre-test, update user state to 'test'
    if (page === 'pre-test') {
        await setUserStudyState(email, 'test');
    } else if (page === 'post-test') {
        await setUserStudyState(email, 'done');
    }
}

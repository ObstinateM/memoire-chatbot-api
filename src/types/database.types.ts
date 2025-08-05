export type Level = 'beginner' | 'intermediate';

export type TestPhase = 'pre-test' | 'test' | 'post-test' | 'done';

export type Group = 'test' | 'control';

export class User {
    id: number;
    email: string;
    level: Level;
    dateConsentResearch: Date;
    dateConsentOpenAI: Date;
    group: Group;

    constructor({
        id,
        email,
        level,
        dateConsentResearch,
        dateConsentOpenAI,
        group,
    }: {
        id: number;
        email: string;
        level: Level;
        dateConsentResearch: string;
        dateConsentOpenAI: string;
        group: Group;
    }) {
        this.id = id;
        this.email = email;
        this.level = level;
        this.dateConsentResearch = new Date(dateConsentResearch);
        this.dateConsentOpenAI = new Date(dateConsentOpenAI);
        this.group = group;
    }
}

export class Question {
    id: number;
    text: string;
    type: 'qcm' | 'likert' | 'text';
    page: 'pre-test' | 'post-test';
    level: Level;
    answers: Answer[] | null;

    constructor({
        id,
        text,
        type,
        page,
        level,
        answers,
    }: {
        id: number;
        text: string;
        type: 'qcm' | 'likert' | 'text';
        page: 'pre-test' | 'post-test';
        level: Level;
        answers?: Answer[] | null;
    }) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.page = page;
        this.level = level;
        this.answers = answers || null;
    }
}

export class Answer {
    id: number;
    text: string;
    questionId: number;

    constructor({ id, text, questionId }: { id: number; text: string; questionId: number }) {
        this.id = id;
        this.text = text;
        this.questionId = questionId;
    }
}

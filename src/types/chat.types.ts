export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMode = 'guard' | 'classic';

export interface ChatMessage {
    id: number;
    session_id: string;
    role: ChatRole;
    content: string;
    mode: ChatMode | null;
    created_at: Date;
}

export interface ChatCompletionInput {
    role: ChatRole;
    content: string;
}

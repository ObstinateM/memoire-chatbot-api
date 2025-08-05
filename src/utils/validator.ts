import { ChatMode, ChatRole } from '../types/chat.types';
import { Level } from '../types/database.types';

export function isValidRole(role: any): role is ChatRole {
    return role === 'user' || role === 'assistant';
}

export function isValidMode(mode: any): mode is ChatMode | undefined {
    return !mode || mode === 'guard' || mode === 'classic';
}

export function isLevel(level: any): level is Level {
    return level === 'beginner' || level === 'intermediate';
}

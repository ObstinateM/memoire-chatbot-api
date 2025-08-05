import { Request, Response } from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { GUARD_MESSAGE_FILENAME } from '../config/env';
import { fetchHistoryBySession, saveMessage } from '../services/history.service';
import { OpenAIStream } from '../services/openai.service';
import { ChatCompletionInput, ChatMode, ChatRole } from '../types/chat.types';

export const handleGetSessionHistory = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
        return res.status(400).json({ error: 'Invalid or missing sessionId' });
    }

    try {
        const history = await fetchHistoryBySession(sessionId);
        return res.status(200).json(history);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la récupération de l'historique" });
    }
};

export const handleChat = async (req: Request, res: Response) => {
    const isValidRole = (role: any): role is ChatRole => role === 'user' || role === 'assistant';

    const isValidMode = (mode: any): mode is ChatMode =>
        !mode || mode === 'guard' || mode === 'classic';

    const { sessionId, message, mode } = req.body;

    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
        return res.status(400).json({ error: 'Invalid or missing sessionId' });
    }

    if (
        !message ||
        typeof message !== 'object' ||
        typeof message.content !== 'string' ||
        message.content.trim() === '' ||
        !isValidRole(message.role)
    ) {
        return res.status(400).json({ error: 'Invalid or missing message structure' });
    }

    if (!isValidMode(mode)) {
        return res.status(400).json({ error: 'Invalid mode' });
    }

    try {
        const previousMessages = await fetchHistoryBySession(sessionId);

        const fullMessages: ChatCompletionInput[] = [];

        const prompt = await readFile(
            path.join(__dirname, '..', '..', GUARD_MESSAGE_FILENAME),
            'utf-8',
        );

        if (mode === 'guard') {
            fullMessages.push({
                role: 'system',
                content: prompt,
            });
        }

        fullMessages.push(...previousMessages, message);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        await saveMessage(sessionId, message.role, message.content, mode);

        let reply = '';
        for await (const chunk of OpenAIStream(fullMessages)) {
            reply += chunk;
            // Stringify the chunk to keep \n etc... formatting
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        await saveMessage(sessionId, 'assistant', reply, mode);
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la requête à GPT' });
    }
};

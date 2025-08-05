import { Request, Response } from 'express';
import {
    getUserFromEmail,
    getUserStudyState,
    saveUser,
    setUserStudyState,
} from '../services/user.service';
import { TestPhase } from '../types/database.types';
import { isLevel } from '../utils/validator';

/**
 * GET /user/:email
 * Récupère un utilisateur à partir de son email
 */
export const handleGetUser = async (req: Request, res: Response) => {
    const { email } = req.params;

    if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'Email invalide ou manquant.' });
    }

    try {
        const user = await getUserFromEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur." });
    }
};

/**
 * POST /user
 * Crée un nouvel utilisateur avec un email et un niveau (beginner ou intermediate)
 * Body: { email: string, level: 'beginner' | 'intermediate' }
 */
export const handleCreateUser = async (req: Request, res: Response) => {
    const { email, level } = req.body;

    if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'Email invalide ou manquant.' });
    }

    if (!isLevel(level)) {
        return res.status(400).json({ error: 'Niveau (level) invalide.' });
    }

    try {
        // Check if user already exists
        let user = await getUserFromEmail(email.trim());
        let state = user ? await getUserStudyState(email.trim()) : 'pre-test';
        if (user) {
            // Idempotent: do not recreate, just return user and state
            return res.status(200).json({ success: true, user, state });
        }
        await saveUser(email.trim(), level);
        await setUserStudyState(email.trim(), 'pre-test');
        user = await getUserFromEmail(email.trim());
        state = await getUserStudyState(email.trim());
        return res.status(201).json({ success: true, user, state });
    } catch (err: any) {
        // Handle unique constraint error just in case
        if (err && err.code === 'SQLITE_CONSTRAINT') {
            const user = await getUserFromEmail(email.trim());
            const state = user ? await getUserStudyState(email.trim()) : 'pre-test';
            return res.status(200).json({ success: true, user, state });
        }
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
    }
};

export const handleGetUserState = async (req: Request, res: Response) => {
    const { email } = req.params;
    if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'Email invalide ou manquant.' });
    }
    try {
        const state = await getUserStudyState(email.trim());
        return res.status(200).json({ state });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ error: "Erreur lors de la récupération de l'état utilisateur." });
    }
};

export const handleSetUserState = async (req: Request, res: Response) => {
    const { email } = req.params;
    const { state } = req.body;
    if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'Email invalide ou manquant.' });
    }
    const validStates: TestPhase[] = ['pre-test', 'test', 'post-test', 'done'];
    if (!validStates.includes(state)) {
        return res.status(400).json({ error: 'State invalide.' });
    }
    try {
        await setUserStudyState(email.trim(), state);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ error: "Erreur lors de la mise à jour de l'état utilisateur." });
    }
};

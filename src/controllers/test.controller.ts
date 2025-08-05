import { Request, Response } from 'express';
import { getQuestionsWithAnswers, saveUserAnswers } from '../services/test.service';
import { getUserFromEmail } from '../services/user.service';

export const handleGetQuestionsAndAnswer = async (req: Request, res: Response) => {
    const { page, email } = req.params;

    if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'Email invalide ou manquant.' });
    }

    if (
        typeof page !== 'string' ||
        page.trim() === '' ||
        (page !== 'pre-test' && page !== 'post-test')
    ) {
        return res.status(400).json({ error: 'Type de page invalide ou manquant.' });
    }

    try {
        const user = await getUserFromEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        const questions = (await getQuestionsWithAnswers(page)).filter(
            (q) => q.level === user.level,
        );
        return res.status(200).json(questions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des questions.' });
    }
};

export const handleSaveUserAnswers = async (req: Request, res: Response) => {
    const { email, page, answers } = req.body;

    if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'Email invalide ou manquant.' });
    }
    if (page !== 'pre-test' && page !== 'post-test') {
        return res.status(400).json({ error: 'Page invalide.' });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'Réponses manquantes.' });
    }
    try {
        await saveUserAnswers(email.trim(), page, answers);
        return res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de l'enregistrement des réponses." });
    }
};

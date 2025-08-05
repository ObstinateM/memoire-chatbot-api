import express from 'express';
import { handleGetQuestionsAndAnswer, handleSaveUserAnswers } from '../controllers/test.controller';

const router = express.Router();
router.get('/:page/:email', handleGetQuestionsAndAnswer);
router.post('/answers', handleSaveUserAnswers);
export default router;

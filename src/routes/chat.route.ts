import express from 'express';
import { handleChat, handleGetSessionHistory } from '../controllers/chat.controller';

const router = express.Router();
router.get('/:sessionId', handleGetSessionHistory);
router.post('/', handleChat);
export default router;

import express from 'express';
import {
    handleCreateUser,
    handleGetUser,
    handleGetUserState,
    handleSetUserState,
} from '../controllers/user.controller';

const router = express.Router();
router.get('/:email', handleGetUser);
router.get('/:email/state', handleGetUserState);
router.post('/:email/state', handleSetUserState);
router.post('/', handleCreateUser);
export default router;

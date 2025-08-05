import cors from 'cors';
import express from 'express';
import { PORT } from './config/env';
import chatRouter from './routes/chat.route';
import testRouter from './routes/test.route';
import userRouter from './routes/user.route';
import { initDb } from './utils/db';

const app = express();
app.use(
    cors({
        origin: '*',
        methods: ['POST', 'GET'],
        allowedHeaders: ['Content-Type'],
    }),
);
app.use(express.json());
app.use('/chat', chatRouter);
app.use('/user', userRouter);
app.use('/test', testRouter);

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

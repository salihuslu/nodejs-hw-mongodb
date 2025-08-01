import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import contactsRouter from './routers/contacts.js';

dotenv.config();

export const setupServer = async () => {
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());

    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }

    app.use('/contacts', contactsRouter);

    app.use((req, res) => {
        res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

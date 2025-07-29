import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const start = async () => {
    try {
        await initMongoConnection();
        setupServer();
    } catch (error) {
        console.error('Failed to start the application:', error.message);
    }
};

start();

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Contact from '../models/Contact.js';
import { readFileSync } from 'fs';

const contacts = JSON.parse(
    readFileSync('data/contacts.json', 'utf-8')
);

const connectionString = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

const seedContacts = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log(' MongoDB connected!');

        await Contact.deleteMany();
        await Contact.insertMany(contacts);
        console.log('Contacts seeded successfully!');
    } catch (error) {
        console.error(' Seeding error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedContacts();

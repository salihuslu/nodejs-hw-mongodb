import Contact from '../models/Contact.js';

export const getAllContacts = async () => {
    try {
        const contacts = await Contact.find();
        return contacts;
    } catch (error) {
        throw new Error('Error fetching contacts');
    }
};

export const getContactById = async (id) => {
    try {
        const contact = await Contact.findById(id);
        return contact;
    } catch (error) {
        throw new Error('Error fetching contact by ID');
    }
};

import {
    getAllContacts,
    getContactById,
    createNewContact,
    updateContactById,
    deleteContactById,
} from '../services/contacts.js';

export const getContacts = async (req, res) => {
    const contacts = await getAllContacts();
    res.json(contacts);
};

export const getContact = async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);
    contact
        ? res.json(contact)
        : res.status(404).json({ message: 'Contact not found' });
};

export const createContact = async (req, res) => {
    const newContact = await createNewContact(req.body);
    res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const updated = await updateContactById(id, req.body);
    updated
        ? res.json(updated)
        : res.status(404).json({ message: 'Contact not found' });
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const deleted = await deleteContactById(id);
    deleted
        ? res.json({ message: 'Contact deleted' })
        : res.status(404).json({ message: 'Contact not found' });
};

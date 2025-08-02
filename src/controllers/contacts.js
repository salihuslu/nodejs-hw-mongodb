import createError from 'http-errors';
import {
    getAllContacts,
    getContactById,
    createNewContact,
    updateContactById,
    deleteContactById,
    patchContactById,
} from '../services/contacts.js';

export const getContacts = async (req, res) => {
    const contacts = await getAllContacts();
    res.json(contacts);
};

export const getContact = async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.json(contact);
};

export const createContact = async (req, res) => {
    const { name, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
        throw createError(400, 'Missing required fields: name, phoneNumber, contactType');
    }

    const newContact = await createNewContact(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const updated = await updateContactById(id, req.body);
    if (!updated) {
        throw createError(404, 'Contact not found');
    }
    res.json(updated);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const deleted = await deleteContactById(id);
    if (!deleted) {
        throw createError(404, 'Contact not found');
    }
    res.json({ message: 'Contact deleted' });
};
export const patchContact = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const allowedFields = ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType'];
    const hasValidField = Object.keys(data).some(key => allowedFields.includes(key));

    if (!hasValidField) {
        throw createError(400, 'At least one valid field is required to update.');
    }

    const updated = await patchContactById(id, data);
    if (!updated) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updated,
    });
};

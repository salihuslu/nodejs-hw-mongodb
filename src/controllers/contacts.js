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
    let {
        page = 1,
        perPage = 10,
        sortBy = 'name',
        sortOrder = 'asc',
        type,
        isFavourite
    } = req.query;

    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;
    const order = sortOrder === 'desc' ? -1 : 1;

    const filter = {};
    if (type) {
        filter.contactType = type;
    }
    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === 'true';
    }

    const [contacts, totalItems] = await Promise.all([
        getAllContacts(skip, limit, false, filter, sortBy, order),
        getAllContacts(0, 0, true, filter)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: {
            data: contacts,
            page: parseInt(page),
            perPage: limit,
            totalItems,
            totalPages,
            hasPreviousPage: parseInt(page) > 1,
            hasNextPage: parseInt(page) < totalPages
        }
    });
};


export const getContact = async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) throw createError(404, 'Contact not found');
    res.json(contact);
};

export const createContact = async (req, res) => {
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
    if (!updated) throw createError(404, 'Contact not found');
    res.json(updated);
};

export const patchContact = async (req, res) => {
    const { id } = req.params;
    const updated = await patchContactById(id, req.body);
    if (!updated) throw createError(404, 'Contact not found');

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updated,
    });
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const deleted = await deleteContactById(id);
    if (!deleted) throw createError(404, 'Contact not found');
    res.status(204).send();
};

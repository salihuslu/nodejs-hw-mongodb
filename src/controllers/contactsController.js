import { getAllContacts, getContactById } from '../services/contacts.js';

export const getContactsController = async (req, res) => {
    try {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to retrieve contacts.',
            error: error.message,
        });
    }
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;

    try {
        const contact = await getContactById(contactId);

        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: `Contact with id ${contactId} not found.`,
            });
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}`,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to retrieve contact.',
            error: error.message,
        });
    }
};

import express from 'express';
import createError from 'http-errors';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(contactsController.getContacts));

router.get('/:id', ctrlWrapper(async (req, res) => {
    const contact = await contactsController.getContact(req, res);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
}));

router.post('/', ctrlWrapper(contactsController.createContact));

router.put('/:id', ctrlWrapper(contactsController.updateContact));

router.delete('/:id', ctrlWrapper(contactsController.deleteContact));

router.patch('/:id', ctrlWrapper(contactsController.patchContact));


export default router;

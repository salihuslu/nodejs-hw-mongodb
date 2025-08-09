import express from 'express';

import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';

const router = express.Router();

router.get('/', ctrlWrapper(contactsController.getContacts));

router.get('/:id', isValidId, ctrlWrapper(contactsController.getContact));

router.post(
    '/',
    validateBody(createContactSchema),
    ctrlWrapper(contactsController.createContact)
);

router.put(
    '/:id',
    isValidId,
    validateBody(createContactSchema),
    ctrlWrapper(contactsController.updateContact)
);

router.patch(
    '/:id',
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(contactsController.patchContact)
);

router.delete('/:id', isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;

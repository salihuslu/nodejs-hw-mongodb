import express from 'express';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(contactsController.getContacts));

router.get('/:id', isValidId, ctrlWrapper(contactsController.getContact));

router.post(
    '/',
    upload.single('photo'),
    validateBody(createContactSchema),
    ctrlWrapper(contactsController.createContact)
);

router.put(
    '/:id',
    isValidId,
    upload.single('photo'),
    validateBody(createContactSchema),
    ctrlWrapper(contactsController.updateContact)
);

router.patch(
    '/:id',
    isValidId,
    upload.single('photo'),
    validateBody(updateContactSchema),
    ctrlWrapper(contactsController.patchContact)
);

router.delete('/:id', isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;

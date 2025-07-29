import express from 'express';
import { getContactsController } from '../controllers/contactController.js';

const router = express.Router();

router.get('/contacts', getContactsController);

export default router;

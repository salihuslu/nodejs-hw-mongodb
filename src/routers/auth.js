import express from 'express';
import { register } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/authSchemas.js';

const router = express.Router();

router.post(
    '/register',
    validateBody(registerSchema),
    ctrlWrapper(register)
);

export default router;

import express from "express";
import * as authController from "../controllers/auth.js";

import { sendResetEmail } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { sendResetEmailSchema } from "../schemas/authSchemas.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);


router.post(
    "/send-reset-email",
    validateBody(sendResetEmailSchema),
    sendResetEmail
);

export default router;

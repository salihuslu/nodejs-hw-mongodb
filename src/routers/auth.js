import express from "express";
import * as authController from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
    registerSchema,
    loginSchema,
    sendResetEmailSchema,
    resetPwdSchema
} from "../schemas/authSchemas.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.post(
    "/send-reset-email",
    validateBody(sendResetEmailSchema),
    authController.sendResetEmail
);
router.post(
    "/reset-pwd",
    validateBody(resetPwdSchema),
    authController.resetPassword
);

export default router;
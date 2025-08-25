import * as authService from "../services/auth.js";
import createHttpError from "http-errors";

import jwt from "jsonwebtoken";
import createError from "http-errors";
import nodemailer from "nodemailer";
import User from "../models/User.js";

export const register = async (req, res, next) => {
    try {
        const data = await authService.register(req.body);
        res.status(201).json({
            status: 201,
            message: "Successfully registered a user!",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw createHttpError(400, "Email and password are required");
        }

        const { accessToken, refreshToken } = await authService.login({
            email,
            password,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: "Successfully logged in!",
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies?.refreshToken;
        if (!oldRefreshToken) {
            throw createHttpError(401, "Refresh token not provided");
        }

        const { accessToken, refreshToken } =
            await authService.refreshTokens(oldRefreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: "Tokens refreshed successfully!",
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await authService.logout(refreshToken);
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
        }

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const sendResetEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        // 1. Kullanıcı var mı kontrol
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(404, "User not found!");
        }

        // 2. Token üret (5 dakika geçerli)
        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );

        // 3. Reset URL oluştur
        const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

        // 4. Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // 5. Mail gönder
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: "Password Reset Request",
            html: `
          <h3>Hello ${user.name || "User"},</h3>
          <p>You requested a password reset.</p>
          <p>Click the link below to reset your password (valid for 5 minutes):</p>
          <a href="${resetUrl}">${resetUrl}</a>
        `,
        };

        await transporter.sendMail(mailOptions).catch(() => {
            throw createError(500, "Failed to send the email, please try again later.");
        });

        res.status(200).json({
            status: 200,
            message: "Reset password email has been successfully sent.",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
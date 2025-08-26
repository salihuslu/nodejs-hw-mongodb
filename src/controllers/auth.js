import * as authService from "../services/auth.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Session from "../models/Session.js";

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

        const user = await User.findOne({ email });
        if (!user) {
            throw createHttpError(404, "User not found!");
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );

        const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

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
            throw createHttpError(500, "Failed to send the email, please try again later.");
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

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw createHttpError(401, "Token is expired or invalid.");
        }

        const user = await User.findOne({ email: payload.email });
        if (!user) {
            throw createHttpError(404, "User not found!");
        }

        user.password = password;
        await user.save();

        await Session.deleteMany({ userId: user._id });

        res.status(200).json({
            status: 200,
            message: "Password has been successfully reset.",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
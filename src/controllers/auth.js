import * as authService from "../services/auth.js";
import createHttpError from "http-errors";

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
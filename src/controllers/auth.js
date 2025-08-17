import * as authService from "../services/auth.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

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
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: "Successfully logged in an user!",
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                status: 401,
                message: "Refresh token not provided",
            });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: "Invalid refresh token",
                });
            }

            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            return res.status(200).json({
                status: 200,
                message: "Access token refreshed successfully",
                data: { accessToken },
            });
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server error",
        });
    }
};

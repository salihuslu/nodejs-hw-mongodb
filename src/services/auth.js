import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/User.js";
import Session from "../models/Session.js";

export const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createHttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
    };
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createHttpError(401, "Invalid email or password");
    }

    await Session.deleteOne({ userId: user._id });

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );

    await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
};

export const refreshTokens = async (oldRefreshToken) => {
    const session = await Session.findOne({ refreshToken: oldRefreshToken });
    if (!session) {
        throw createHttpError(401, "Invalid refresh token");
    }

    try {
        jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
        throw createHttpError(401, "Expired refresh token");
    }

    const newAccessToken = jwt.sign(
        { id: session.userId },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
        { id: session.userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    session.refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (refreshToken) => {
    await Session.deleteOne({ refreshToken });
};

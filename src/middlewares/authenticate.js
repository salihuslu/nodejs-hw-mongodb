import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/Session.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createHttpError(401, 'Authorization header missing or invalid');
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw createHttpError(401, 'Access token expired');
            }
            throw createHttpError(401, 'Invalid access token');
        }

        const session = await Session.findOne({
            userId: decoded.id,
            accessToken: token,
            accessTokenValidUntil: { $gt: new Date() }
        });

        if (!session) {
            throw createHttpError(401, 'Invalid or expired session');
        }

        req.user = {
            id: decoded.id,
            sessionId: session._id
        };

        next();
    } catch (error) {
        next(error);
    }
};
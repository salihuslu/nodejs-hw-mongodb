const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const Session = require('../models/Session');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createHttpError(401, 'Not authorized');
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            throw createHttpError(401, 'Not authorized');
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        const session = await Session.findOne({
            userId: decoded.userId,
            accessToken,
        });

        if (!session || new Date() > session.accessTokenValidUntil) {
            throw createHttpError(401, 'Not authorized');
        }

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            next(createHttpError(401, 'Token expired'));
        } else if (error.name === 'JsonWebTokenError') {
            next(createHttpError(401, 'Invalid token'));
        } else {
            next(error);
        }
    }
};

module.exports = authenticate;
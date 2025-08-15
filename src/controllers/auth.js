import { registerUser } from '../services/auth.js';

export const register = async (req, res) => {
    const userData = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: userData,
    });
};

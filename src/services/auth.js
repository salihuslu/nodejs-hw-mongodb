import bcrypt from 'bcrypt';
import createError from 'http-errors';
import User from '../models/User.js';

export const registerUser = async ({ name, email, password }) => {
    // 1. Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(409, 'Email in use');
    }

    // 2. Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Yeni kullanıcı oluşturma
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // 4. Şifreyi yanıt öncesi kaldırma
    const userData = newUser.toObject();
    delete userData.password;

    return userData;
};

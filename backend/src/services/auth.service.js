import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'FERME_SECRET_2026';

export const register = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    return await user.save();
};

export const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Identifiants invalides');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Identifiants invalides');

    const token = jwt.sign(
        { id: user._id, role: user.role, dept: user.department },
        secret,
        { expiresIn: '8h' }
    );

    return { token, user: { id: user._id, name: user.name, role: user.role } };
};

export const verifyToken = (token) => jwt.verify(token, secret);
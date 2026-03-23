// Authentication controller (login, logout, tokens)
import * as authService from '../services/auth.service.js';
import User from '../models/User.js';
export const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'Utilisateur créé', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
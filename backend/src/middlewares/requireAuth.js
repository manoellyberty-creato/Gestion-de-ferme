import { verifyToken } from '../services/auth.service.js';

export default (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Non autorisé' });

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide' });
    }
};


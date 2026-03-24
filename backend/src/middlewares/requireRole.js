/**
 * Middleware pour restreindre l'accès à certains rôles
 * @param {String[]} roles - Tableau des rôles autorisés (ex: ['admin', 'veterinaire'])
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        // Le user est injecté dans req par le middleware requireAuth juste avant
        if (!req.user) {
            return res.status(401).json({ message: "Authentification requise" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Accès interdit : votre rôle (${req.user.role}) ne permet pas cette action.` 
            });
        }

        next();
    };
};

export default requireRole;
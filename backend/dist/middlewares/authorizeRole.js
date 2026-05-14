"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        if (allowedRoles.includes(user.fk_id_rol)) {
            next();
        }
        else {
            res.status(403).json({
                error: `Acceso denegado: Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
            });
        }
    };
};
exports.authorizeRole = authorizeRole;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const authorizeAdmin = (req, res, next) => {
    const user = req.user;
    if (user && user.fk_id_rol === 1) {
        next(); // Se dejar pasar por el rol
    }
    else {
        res.status(403).json({ error: 'Acceso denegado: Se requieren privilegios de administrador' });
    }
};
exports.authorizeAdmin = authorizeAdmin;

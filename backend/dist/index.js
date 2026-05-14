"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const laboratorioRoutes_1 = __importDefault(require("./routes/laboratorioRoutes"));
const modulosRoutes_1 = __importDefault(require("./routes/modulosRoutes"));
const proyectosRoutes_1 = __importDefault(require("./routes/proyectosRoutes"));
const db_1 = require("./config/db");
const homeAssistantRoutes_1 = __importDefault(require("./routes/homeAssistantRoutes"));
const rolRoutes_1 = __importDefault(require("./routes/rolRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const haWebSocketService_1 = require("./services/haWebSocketService");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas
app.use('/api', authRoutes_1.default);
app.use('/api', userRoutes_1.default);
app.use('/api', laboratorioRoutes_1.default);
app.use('/api', modulosRoutes_1.default);
app.use('/api', proyectosRoutes_1.default);
app.use('/api', homeAssistantRoutes_1.default);
app.use('/api', rolRoutes_1.default);
app.use('/api', dashboardRoutes_1.default);
// Ruta raíz
app.get('/', (req, res) => {
    res.send('Backend de LabControl Pro corriendo...');
});
// Iniciar servidor
const PORT = process.env.PORT || 4000;
const startServer = async () => {
    try {
        const connection = await db_1.pool.getConnection();
        console.log('Conexión a MySQL establecida');
        connection.release();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            // Iniciar el puente WebSocket para Unity y Home Assistant
            (0, haWebSocketService_1.startHAWebsocketServer)();
        });
    }
    catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};
startServer();

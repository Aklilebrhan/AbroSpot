"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const index_js_1 = require("./routes/index.js");
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({ origin: '*' }));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, morgan_1.default)('dev'));
// Main API Router
exports.app.use('/api', index_js_1.apiRouter);
// Root
exports.app.get('/', (req, res) => {
    res.json({
        app: 'AbroSpot REST API Backend',
        version: '1.0.0',
        documentation: '/api/health',
    });
});
// Centralized error handling
exports.app.use(errorHandler_js_1.errorHandler);

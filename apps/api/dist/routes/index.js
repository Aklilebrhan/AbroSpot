"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const eventRoutes_js_1 = require("./eventRoutes.js");
const categoryRoutes_js_1 = require("./categoryRoutes.js");
const sourceRoutes_js_1 = require("./sourceRoutes.js");
const adminRoutes_js_1 = require("./adminRoutes.js");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use('/events', eventRoutes_js_1.eventRouter);
exports.apiRouter.use('/categories', categoryRoutes_js_1.categoryRouter);
exports.apiRouter.use('/sources', sourceRoutes_js_1.sourceRouter);
exports.apiRouter.use('/admin', adminRoutes_js_1.adminRouter);
exports.apiRouter.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AbroSpot Core Express API',
        timestamp: new Date().toISOString(),
    });
});

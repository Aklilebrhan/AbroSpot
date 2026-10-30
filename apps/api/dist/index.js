"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const config_js_1 = require("./config.js");
const server = app_js_1.app.listen(config_js_1.config.port, () => {
    console.log(`🚀 AbroSpot Express API running on http://localhost:${config_js_1.config.port}`);
    console.log(`📡 Environment: ${config_js_1.config.env}`);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

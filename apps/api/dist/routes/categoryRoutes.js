"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const categoryController_js_1 = require("../controllers/categoryController.js");
exports.categoryRouter = (0, express_1.Router)();
exports.categoryRouter.get('/', (req, res, next) => categoryController_js_1.categoryController.getCategories(req, res, next));
exports.categoryRouter.get('/:slug', (req, res, next) => categoryController_js_1.categoryController.getCategoryBySlug(req, res, next));

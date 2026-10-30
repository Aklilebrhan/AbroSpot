"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = exports.EventController = void 0;
const eventService_js_1 = require("../services/eventService.js");
class EventController {
    async getEvents(req, res, next) {
        try {
            const { page, limit, category, subCity, isFeatured, startDate, endDate, search } = req.query;
            const data = await eventService_js_1.eventService.getEvents({
                page: page ? parseInt(page, 10) : undefined,
                limit: limit ? parseInt(limit, 10) : undefined,
                category: category,
                subCity: subCity,
                isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
                startDate: startDate,
                endDate: endDate,
                search: search,
            });
            res.json(data);
        }
        catch (e) {
            next(e);
        }
    }
    async getUpcoming(req, res, next) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
            const data = await eventService_js_1.eventService.getUpcomingEvents(limit);
            res.json(data);
        }
        catch (e) {
            next(e);
        }
    }
    async getEventById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const event = await eventService_js_1.eventService.getEventByIdOrSlug(id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json(event);
        }
        catch (e) {
            next(e);
        }
    }
    async getEventSources(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const sources = await eventService_js_1.eventService.getEventSources(id);
            res.json(sources);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.EventController = EventController;
exports.eventController = new EventController();

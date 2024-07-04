"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.get('/api/hello', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip;
    try {
        const locationResponse = yield axios_1.default.get(`http://ip-api.com/json/${clientIp}`);
        const location = locationResponse.data.city;
        const temperature = 11; // Replace with actual temperature retrieval logic
        res.json({
            client_ip: clientIp,
            location,
            greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`,
        });
    }
    catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.get('/', (req, res) => {
    res.send('Welcome to the API server!');
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
exports.default = app;

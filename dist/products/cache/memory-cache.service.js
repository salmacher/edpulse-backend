"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MemoryCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCacheService = void 0;
const common_1 = require("@nestjs/common");
let MemoryCacheService = MemoryCacheService_1 = class MemoryCacheService {
    constructor() {
        this.logger = new common_1.Logger(MemoryCacheService_1.name);
        this.cache = new Map();
        this.TTL = 60000;
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        const isExpired = Date.now() - entry.timestamp > this.TTL;
        if (isExpired) {
            this.logger.debug(`Cache expired for key: ${key}`);
            this.cache.delete(key);
            return null;
        }
        this.logger.debug(`Cache hit for key: ${key}`);
        return entry.data;
    }
    set(key, data) {
        this.logger.debug(`Cache set for key: ${key}`);
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
    clear() {
        this.logger.debug('Cache cleared');
        this.cache.clear();
    }
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
};
exports.MemoryCacheService = MemoryCacheService;
exports.MemoryCacheService = MemoryCacheService = MemoryCacheService_1 = __decorate([
    (0, common_1.Injectable)()
], MemoryCacheService);
//# sourceMappingURL=memory-cache.service.js.map
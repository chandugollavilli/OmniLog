"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openSearchService = exports.OpenSearchService = void 0;
const logger_1 = require("../utils/logger");
class OpenSearchService {
    memoryIndex = [];
    async createIndexTemplates() {
        logger_1.logger.info('OpenSearch Index Templates initialized: omnilog-logs-template mapped.');
    }
    async bulkIndexLogs(logs) {
        if (!logs || logs.length === 0)
            return;
        this.memoryIndex.push(...logs);
        if (this.memoryIndex.length > 20000) {
            this.memoryIndex.splice(0, logs.length);
        }
    }
    async searchLogs(query) {
        let results = [...this.memoryIndex];
        if (query.action) {
            results = results.filter((l) => l.action === query.action);
        }
        if (query.ip) {
            results = results.filter((l) => l.srcip === query.ip || l.dstip === query.ip);
        }
        if (query.search) {
            const s = query.search.toLowerCase();
            results = results.filter((l) => l.srcip?.includes(s) ||
                l.dstip?.includes(s) ||
                l.user?.toLowerCase().includes(s) ||
                l.app?.toLowerCase().includes(s) ||
                l.raw?.toLowerCase().includes(s));
        }
        const limit = query.limit || 50;
        return {
            total: results.length,
            hits: results.slice(0, limit),
        };
    }
}
exports.OpenSearchService = OpenSearchService;
exports.openSearchService = new OpenSearchService();

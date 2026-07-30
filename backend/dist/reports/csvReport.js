"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSVReport = generateCSVReport;
const json2csv_1 = require("json2csv");
function generateCSVReport(data) {
    if (!data || data.length === 0) {
        return 'No data available for the requested report period.';
    }
    // Format BigInt values to string
    const cleanData = data.map((item) => {
        const formatted = {};
        for (const [key, val] of Object.entries(item)) {
            if (typeof val === 'bigint') {
                formatted[key] = val.toString();
            }
            else if (val instanceof Date) {
                formatted[key] = val.toISOString();
            }
            else {
                formatted[key] = val;
            }
        }
        return formatted;
    });
    const json2csvParser = new json2csv_1.Parser();
    return json2csvParser.parse(cleanData);
}

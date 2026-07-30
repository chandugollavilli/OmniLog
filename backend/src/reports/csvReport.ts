import { Parser } from 'json2csv';

export function generateCSVReport(data: any[]): string {
  if (!data || data.length === 0) {
    return 'No data available for the requested report period.';
  }

  // Format BigInt values to string
  const cleanData = data.map((item) => {
    const formatted: Record<string, any> = {};
    for (const [key, val] of Object.entries(item)) {
      if (typeof val === 'bigint') {
        formatted[key] = val.toString();
      } else if (val instanceof Date) {
        formatted[key] = val.toISOString();
      } else {
        formatted[key] = val;
      }
    }
    return formatted;
  });

  const json2csvParser = new Parser();
  return json2csvParser.parse(cleanData);
}

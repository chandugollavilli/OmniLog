import { prisma } from '../database/prisma';
import { generateCSVReport } from './csvReport';
import { generatePDFReport } from './pdfReport';
import { ReportType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export async function createReport(
  title: string,
  type: ReportType,
  format: 'PDF' | 'CSV',
  startDate: Date,
  endDate: Date,
  generatedBy?: string
) {
  const logs = await prisma.firewallLog.findMany({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    take: 5000,
    orderBy: { timestamp: 'desc' },
  });

  const totalLogs = logs.length;
  const allowedLogs = logs.filter((l) => l.action === 'accept' || l.action === 'pass').length;
  const deniedLogs = logs.filter((l) => l.action === 'deny' || l.action === 'drop' || l.action === 'close').length;

  let totalBytesNum = 0n;
  const srcIpMap: Record<string, number> = {};
  const polMap: Record<string, number> = {};

  for (const log of logs) {
    if (log.sentbyte) totalBytesNum += log.sentbyte;
    if (log.rcvdbyte) totalBytesNum += log.rcvdbyte;

    if (log.srcip) {
      srcIpMap[log.srcip] = (srcIpMap[log.srcip] || 0) + 1;
    }
    const polName = log.polname || 'Default';
    polMap[polName] = (polMap[polName] || 0) + 1;
  }

  const topAttackers = Object.entries(srcIpMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([srcip, count]) => ({ srcip, count }));

  const topPolicies = Object.entries(polMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([polname, count]) => ({ polname, count }));

  const totalBytesFormatted = (Number(totalBytesNum) / (1024 * 1024)).toFixed(2) + ' MB';

  const reportsDir = path.resolve(__dirname, '../../uploads/reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filename = `report_${Date.now()}.${format.toLowerCase()}`;
  const filePath = path.join(reportsDir, filename);

  if (format === 'CSV') {
    const csvContent = generateCSVReport(logs);
    fs.writeFileSync(filePath, csvContent);
  } else {
    const pdfBuffer = await generatePDFReport(
      title,
      { totalLogs, allowedLogs, deniedLogs, totalBytes: totalBytesFormatted },
      topAttackers,
      topPolicies
    );
    fs.writeFileSync(filePath, pdfBuffer);
  }

  const fileUrl = `/uploads/reports/${filename}`;

  const reportRecord = await prisma.report.create({
    data: {
      title,
      type,
      startDate,
      endDate,
      fileUrl,
      format,
      generatedBy,
    },
  });

  return reportRecord;
}

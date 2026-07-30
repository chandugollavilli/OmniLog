import PDFDocument from 'pdfkit';

export function generatePDFReport(
  title: string,
  summary: { totalLogs: number; allowedLogs: number; deniedLogs: number; totalBytes: string },
  topAttackers: Array<{ srcip: string; count: number }>,
  topPolicies: Array<{ polname: string; count: number }>
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Title & Header
      doc.fillColor('#0f172a').fontSize(22).text('OmniLog Enterprise Report', { align: 'center' });
      doc.moveDown(0.3);
      doc.fillColor('#334155').fontSize(14).text(title, { align: 'center' });
      doc.fontSize(10).fillColor('#64748b').text(`Generated at: ${new Date().toUTCString()}`, { align: 'center' });
      doc.moveDown(1.5);

      // Section: Executive Summary
      doc.fillColor('#0f172a').fontSize(14).text('1. Executive Summary', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#334155');
      doc.text(`Total Firewall Log Volume: ${summary.totalLogs.toLocaleString()}`);
      doc.text(`Allowed Connections: ${summary.allowedLogs.toLocaleString()}`);
      doc.text(`Denied / Blocked Connections: ${summary.deniedLogs.toLocaleString()}`);
      doc.text(`Total Bandwidth Consumed: ${summary.totalBytes}`);
      doc.moveDown(1.5);

      // Section: Top Attackers / Source IPs
      doc.fillColor('#0f172a').fontSize(14).text('2. Top Source IPs / Attackers', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#1e293b');
      if (topAttackers.length === 0) {
        doc.text('No source IP data recorded.');
      } else {
        topAttackers.forEach((item, idx) => {
          doc.text(`${idx + 1}. IP: ${item.srcip} - Event Count: ${item.count.toLocaleString()}`);
        });
      }
      doc.moveDown(1.5);

      // Section: Top Firewall Policies
      doc.fillColor('#0f172a').fontSize(14).text('3. Top Active Firewall Policies', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#1e293b');
      if (topPolicies.length === 0) {
        doc.text('No policy data recorded.');
      } else {
        topPolicies.forEach((item, idx) => {
          doc.text(`${idx + 1}. Policy: ${item.polname || 'Implicit / Default'} - Count: ${item.count.toLocaleString()}`);
        });
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(9).fillColor('#94a3b8').text('OmniLog - Open-Source FortiAnalyzer Alternative | Confidential Security Audit Report', {
        align: 'center',
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

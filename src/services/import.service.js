const exceljs = require('exceljs');
const prisma = require('../config/prisma');

const importFromExcel = async (filePath) => {
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const campaignSheet = workbook.getWorksheet(1);
  
  const results = {
    total: 0,
    success: 0,
    failed: 0,
    errors: []
  };

  // Collect all rows first (eachRow doesn't support async)
  const rows = [];
  campaignSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    rows.push({ row, rowNumber });
  });

  // Process rows sequentially with proper await
  for (const { row, rowNumber } of rows) {
    try {
      results.total++;
      
      const bulan = row.getCell(1).value; // Bulan
      const campaignExtId = parseInt(row.getCell(2).value); // ID Campaign
      const productName = String(row.getCell(3).value || '').trim(); // Produk
      const campaignName = String(row.getCell(4).value || '').trim(); // Nama Campaign
      const link = row.getCell(5).value; // Link
      const platformName = String(row.getCell(6).value || '').trim(); // Platform
      const beneficiaryName = String(row.getCell(7).value || '').trim(); // Nama PM (Beneficiary)
      const contributorName = String(row.getCell(8).value || '').trim(); // Kontributor
      const capaian = parseFloat(row.getCell(9).value || 0);
      const danaCair = parseFloat(row.getCell(10).value || 0);
      const pencairan = parseFloat(row.getCell(11).value || 0);
      const dpProgram = parseFloat(row.getCell(12).value || 0);

      if (!campaignExtId || isNaN(campaignExtId)) {
        results.failed++;
        results.errors.push({ row: rowNumber, message: 'Invalid Campaign ID' });
        continue;
      }

      if (!productName) {
        results.failed++;
        results.errors.push({ row: rowNumber, message: 'Product name is required' });
        continue;
      }

      // 1. Get or Create Category (Default to "General")
      let category = await prisma.programCategory.findFirst({ where: { name: 'General' } });
      if (!category) {
        category = await prisma.programCategory.create({ data: { name: 'General' } });
      }

      // 2. Get or Create Product
      let product = await prisma.product.findUnique({ where: { name: productName } });
      if (!product) {
        product = await prisma.product.create({
          data: { name: productName, categoryId: category.id }
        });
      }

      // 3. Get or Create Platform
      let platform = null;
      if (platformName) {
        platform = await prisma.platform.findUnique({ where: { name: platformName } });
        if (!platform) {
          platform = await prisma.platform.create({ data: { name: platformName } });
        }
      }

      // 4. Get or Create Beneficiary
      let beneficiary = null;
      if (beneficiaryName) {
        beneficiary = await prisma.beneficiary.findUnique({ where: { name: beneficiaryName } });
        if (!beneficiary) {
          beneficiary = await prisma.beneficiary.create({ data: { name: beneficiaryName } });
        }
      }

      // 5. Get or Create Contributor
      let contributor = null;
      if (contributorName) {
        contributor = await prisma.contributor.findUnique({ where: { name: contributorName } });
        if (!contributor) {
          contributor = await prisma.contributor.create({ data: { name: contributorName } });
        }
      }

      // 6. Map month name to Date
      const year = new Date().getFullYear();
      const monthMap = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      const monthIndex = monthMap[bulan] !== undefined ? monthMap[bulan] : 0;
      const period = new Date(year, monthIndex, 1);

      // Resolve link value (exceljs may return {text, hyperlink} for hyperlinks)
      const resolvedLink = typeof link === 'object' && link !== null ? (link.text || link.hyperlink || '') : (link || '');

      await prisma.campaign.upsert({
        where: { campaignExtId },
        update: {
          name: campaignName,
          link: resolvedLink,
          period,
          productId: product.id,
          platformId: platform?.id || null,
          beneficiaryId: beneficiary?.id || null,
          contributorId: contributor?.id || null,
          capaian,
          danaCair,
          pencairan,
          dpProgram
        },
        create: {
          campaignExtId,
          name: campaignName,
          link: resolvedLink,
          period,
          productId: product.id,
          platformId: platform?.id || null,
          beneficiaryId: beneficiary?.id || null,
          contributorId: contributor?.id || null,
          capaian,
          danaCair,
          pencairan,
          dpProgram
        }
      });

      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ row: rowNumber, message: error.message });
    }
  }

  return results;
};

module.exports = {
  importFromExcel
};

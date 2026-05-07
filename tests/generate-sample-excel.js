/**
 * Generate sample Excel file for import testing
 * Run: node tests/generate-sample-excel.js
 */

const exceljs = require('exceljs');
const path = require('path');

const generateSampleExcel = async () => {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet('Campaign Data');

  // Headers matching the spreadsheet format
  sheet.columns = [
    { header: 'Bulan', key: 'bulan', width: 12 },
    { header: 'ID Campaign', key: 'campaignExtId', width: 14 },
    { header: 'Produk', key: 'produk', width: 20 },
    { header: 'Nama Campaign', key: 'namaCampaign', width: 50 },
    { header: 'Link', key: 'link', width: 30 },
    { header: 'Platform', key: 'platform', width: 15 },
    { header: 'Nama PM', key: 'namaPm', width: 20 },
    { header: 'Kontributor', key: 'kontributor', width: 15 },
    { header: 'Capaian', key: 'capaian', width: 15 },
    { header: 'Dana Cair', key: 'danaCair', width: 15 },
    { header: 'Pencairan', key: 'pencairan', width: 15 },
    { header: 'DP Program', key: 'dpProgram', width: 15 }
  ];

  // Style header
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' }
  };

  // Sample data from the spreadsheet
  const rows = [
    {
      bulan: 'Februari',
      campaignExtId: 8421,
      produk: 'Fidyah',
      namaCampaign: 'Tunaikan Fidyah, Berikan Kebermanfaatan Bagi Mereka Yang Memerlukan',
      link: 'https://raihimip.com',
      platform: 'raihimip',
      namaPm: 'Raih Harapan',
      kontributor: '',
      capaian: 435000,
      danaCair: 0,
      pencairan: 325050,
      dpProgram: 60000
    },
    {
      bulan: 'Maret',
      campaignExtId: 8634,
      produk: 'RBSP',
      namaCampaign: 'Kembalikan Senyuman Mereka Dengan Makanan Berbuka Puasa',
      link: 'https://raihimip.com',
      platform: 'raihimip',
      namaPm: 'Raih Harapan',
      kontributor: 'Hadid',
      capaian: 1045000,
      danaCair: 0,
      pencairan: 368128,
      dpProgram: 53940
    },
    {
      bulan: 'Maret',
      campaignExtId: 6604,
      produk: 'RBSP',
      namaCampaign: 'Berburu Amalan Dengan Berbagi Makanan Berbuka Puasa',
      link: 'https://raihimip.com',
      platform: 'raihimip',
      namaPm: 'Raih Harapan',
      kontributor: '',
      capaian: 1290000,
      danaCair: 0,
      pencairan: 166113,
      dpProgram: 0
    },
    {
      bulan: 'Maret',
      campaignExtId: 6693,
      produk: 'Reguler',
      namaCampaign: 'Becaknya Sepi Penumpang. Bantu Kakek 74 Tahun Bertahan Hidup',
      link: 'https://raihimip.com',
      platform: 'raihimip',
      namaPm: 'Raih Harapan',
      kontributor: 'Atang',
      capaian: 2510000,
      danaCair: 19300,
      pencairan: 472631,
      dpProgram: 70895
    },
    {
      bulan: 'Maret',
      campaignExtId: 6493,
      produk: 'Reguler',
      namaCampaign: 'Raih Pahala, Bantu Lansia Di Hari Tua',
      link: 'https://raihimip.com',
      platform: 'raihimip',
      namaPm: 'Raih Harapan',
      kontributor: 'Inoh',
      capaian: 785000,
      danaCair: 0,
      pencairan: 291803,
      dpProgram: 43740
    },
    {
      bulan: 'Maret',
      campaignExtId: 6593,
      produk: 'THR Pejuang Nafkah',
      namaCampaign: 'Hadirkan Kebahagiaan Untuk Mereka yang Berjuang',
      link: 'https://raihimip.com',
      platform: 'raihimip',
      namaPm: 'Raih Harapan',
      kontributor: 'yahya',
      capaian: 955000,
      danaCair: 0,
      pencairan: 131017,
      dpProgram: 10815
    },
    {
      bulan: 'Maret',
      campaignExtId: 6425,
      produk: 'Baju Lebaran',
      namaCampaign: 'Patungan Baju Lebaran, Hadiah Cinta untuk Anak Yatim Piatu',
      link: 'https://raihimip.com',
      platform: 'raihimip',
      namaPm: 'Raih Harapan',
      kontributor: 'Sofia',
      capaian: 2568000,
      danaCair: 952288,
      pencairan: 171058,
      dpProgram: 10647
    }
  ];

  rows.forEach(row => sheet.addRow(row));

  const filePath = path.join(__dirname, 'sample-import.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ Sample Excel file created: ${filePath}`);
};

generateSampleExcel().catch(console.error);

/**
 * Automated API Test Script for SIM Program Backend
 * 
 * Run: node tests/test-api.js
 * 
 * Prerequisite: Server must be running on http://localhost:3000
 * Each run uses unique names to avoid conflicts with previous runs.
 */

const BASE_URL = 'http://localhost:3000/api/v1';
const RUN_ID = Date.now(); // Unique per test run

let accessToken = '';
let refreshToken = '';
let testEmail = '';
let categoryId = null;
let productId = null;
let platformId = null;
let contributorId = null;
let beneficiaryId = null;
let campaignId = null;

const results = { passed: 0, failed: 0, errors: [] };

// Helper function for API calls
const api = async (method, path, body = null, useAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  return { status: res.status, data };
};

// Test runner
const test = async (name, fn) => {
  try {
    await fn();
    results.passed++;
    console.log(`  ✅ ${name}`);
  } catch (error) {
    results.failed++;
    results.errors.push({ name, error: error.message });
    console.log(`  ❌ ${name}: ${error.message}`);
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

// ========== TESTS ==========

const runTests = async () => {
  console.log('\n🧪 SIM Program API Tests\n');
  console.log(`   Run ID: ${RUN_ID}`);
  console.log('================================');

  testEmail = `admin-${RUN_ID}@test.com`;

  // Phase 1: Auth
  console.log('\n📌 Phase 1: Authentication');

  await test('TC-01: Register User', async () => {
    const { status, data } = await api('POST', '/auth/register', {
      name: 'Admin Test',
      email: testEmail,
      password: 'password123'
    }, false);
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    assert(data.success === true, 'success should be true');
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
  });

  await test('TC-02: Register Duplicate Email', async () => {
    const res = await api('POST', '/auth/register', {
      name: 'Admin Test 2',
      email: testEmail,
      password: 'password123'
    }, false);
    assert(res.status === 409, `Expected 409, got ${res.status}`);
  });

  await test('TC-03: Login User', async () => {
    const { status, data } = await api('POST', '/auth/login', {
      email: testEmail,
      password: 'password123'
    }, false);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
    assert(data.data.accessToken, 'Should return accessToken');
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
  });

  await test('TC-04: Login Invalid Credentials', async () => {
    const { status } = await api('POST', '/auth/login', {
      email: testEmail,
      password: 'wrongpassword'
    }, false);
    assert(status === 401, `Expected 401, got ${status}`);
  });

  await test('TC-05: Refresh Token', async () => {
    const { status, data } = await api('POST', '/auth/refresh', {
      refreshToken
    }, false);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
    assert(data.data.accessToken, 'Should return new accessToken');
  });

  await test('TC-06: Unauthorized Access', async () => {
    const { status } = await api('GET', '/campaigns', null, false);
    assert(status === 401, `Expected 401, got ${status}`);
  });

  // Phase 2: Program Category
  console.log('\n📌 Phase 2: Program Category');

  await test('TC-07: Create Program Category', async () => {
    const { status, data } = await api('POST', '/program-categories', {
      name: `Donasi-${RUN_ID}`,
      description: 'Kategori program donasi'
    });
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    categoryId = data.data.id;
  });

  await test('TC-08: Create Duplicate Category', async () => {
    const { status } = await api('POST', '/program-categories', {
      name: `Donasi-${RUN_ID}`
    });
    assert(status === 409, `Expected 409, got ${status}`);
  });

  await test('TC-09: Get All Categories', async () => {
    const { status, data } = await api('GET', '/program-categories');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.data), 'data should be an array');
  });

  await test('TC-10: Get Category by ID', async () => {
    const { status, data } = await api('GET', `/program-categories/${categoryId}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.data.id === categoryId, 'ID should match');
  });

  await test('TC-11: Update Category', async () => {
    const { status, data } = await api('PUT', `/program-categories/${categoryId}`, {
      name: `Program Donasi-${RUN_ID}`,
      description: 'Kategori program donasi dan zakat'
    });
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(data)}`);
  });

  await test('TC-12: Get Category Not Found', async () => {
    const { status } = await api('GET', '/program-categories/99999');
    assert(status === 404, `Expected 404, got ${status}`);
  });

  // Phase 3: Product
  console.log('\n📌 Phase 3: Product');

  await test('TC-13: Create Product', async () => {
    const { status, data } = await api('POST', '/products', {
      name: `Fidyah-${RUN_ID}`,
      description: 'Produk fidyah',
      categoryId
    });
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    productId = data.data.id;
  });

  await test('TC-14: Create Product Duplicate Name', async () => {
    const { status } = await api('POST', '/products', {
      name: `Fidyah-${RUN_ID}`,
      categoryId
    });
    assert(status === 409, `Expected 409, got ${status}`);
  });

  await test('TC-15: Create Product Invalid Category', async () => {
    const { status } = await api('POST', '/products', {
      name: `RBSP-${RUN_ID}`,
      categoryId: 99999
    });
    assert(status === 404, `Expected 404, got ${status}`);
  });

  await test('TC-16: Get All Products (with category)', async () => {
    const { status, data } = await api('GET', '/products');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.data.length > 0, 'Should have at least one product');
    assert(data.data[0].category, 'Product should include category');
  });

  await test('TC-17: Update Product', async () => {
    const { status, data } = await api('PUT', `/products/${productId}`, {
      description: 'Produk fidyah Ramadhan'
    });
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(data)}`);
  });

  // Phase 4: Platform
  console.log('\n📌 Phase 4: Platform');

  await test('TC-18: Create Platform', async () => {
    const { status, data } = await api('POST', '/platforms', {
      name: `raihimip-${RUN_ID}`
    });
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    platformId = data.data.id;
  });

  await test('TC-19: Get All Platforms', async () => {
    const { status } = await api('GET', '/platforms');
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('TC-20: Update Platform', async () => {
    const { status, data } = await api('PUT', `/platforms/${platformId}`, {
      url: 'https://www.raihimip.com'
    });
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(data)}`);
  });

  // Phase 5: Contributor
  console.log('\n📌 Phase 5: Contributor');

  await test('TC-21: Create Contributor', async () => {
    const { status, data } = await api('POST', '/contributors', {
      name: `Hadid-${RUN_ID}`,
      phone: '081234567890'
    });
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    contributorId = data.data.id;
  });

  await test('TC-22: Get All Contributors', async () => {
    const { status } = await api('GET', '/contributors');
    assert(status === 200, `Expected 200, got ${status}`);
  });

  // Phase 6: Beneficiary
  console.log('\n📌 Phase 6: Beneficiary');

  await test('TC-23: Create Beneficiary', async () => {
    const { status, data } = await api('POST', '/beneficiaries', {
      name: `Raih Harapan-${RUN_ID}`,
      description: 'Penerima manfaat utama'
    });
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    beneficiaryId = data.data.id;
  });

  await test('TC-24: Get All Beneficiaries', async () => {
    const { status } = await api('GET', '/beneficiaries');
    assert(status === 200, `Expected 200, got ${status}`);
  });

  // Phase 7: Campaign
  console.log('\n📌 Phase 7: Campaign');

  const extId = Math.floor(RUN_ID / 1000); // Unique but smaller

  await test('TC-26: Create Campaign', async () => {
    const { status, data } = await api('POST', '/campaigns', {
      campaignExtId: extId,
      name: 'Tunaikan Fidyah, Berikan Kebermanfaatan Bagi Mereka',
      link: 'https://raihimip.com/campaign/8421',
      period: '2026-02-01',
      productId,
      platformId,
      beneficiaryId,
      contributorId,
      capaian: 435000,
      danaCair: 0,
      pencairan: 325050,
      dpProgram: 60000
    });
    assert(status === 201, `Expected 201, got ${status}: ${JSON.stringify(data)}`);
    campaignId = data.data.id;
  });

  await test('TC-27: Create Campaign Duplicate ExtId', async () => {
    const { status } = await api('POST', '/campaigns', {
      campaignExtId: extId,
      name: 'Duplicate',
      period: '2026-02-01',
      productId
    });
    assert(status === 409, `Expected 409, got ${status}`);
  });

  await test('TC-28: Get All Campaigns (Pagination)', async () => {
    const { status, data } = await api('GET', '/campaigns?page=1&limit=5');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.pagination, 'Should include pagination');
    assert(data.pagination.page === 1, 'Page should be 1');
  });

  await test('TC-29: Get All Campaigns (Search)', async () => {
    const { status } = await api('GET', '/campaigns?search=Fidyah');
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('TC-30: Get Campaign by ID (nested)', async () => {
    const { status, data } = await api('GET', `/campaigns/${campaignId}`);
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(data)}`);
    assert(data.data.product, 'Should include product');
    assert(data.data.platform, 'Should include platform');
    assert(data.data.beneficiary, 'Should include beneficiary');
    assert(data.data.contributor, 'Should include contributor');
  });

  await test('TC-31: Update Campaign', async () => {
    const { status, data } = await api('PUT', `/campaigns/${campaignId}`, {
      capaian: 500000,
      danaCair: 100000
    });
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(data)}`);
  });

  // Phase 8: DSS Record
  console.log('\n📌 Phase 8: DSS Record');

  await test('TC-33: Create DSS Record (nested)', async () => {
    const { status, data } = await api('POST', '/dss-records', {
      campaignId,
      dss: 190571,
      profilPm: 190571,
      profilBaru: 0,
      dssZa: 264083,
      noSppp: 'KPP-Rahimmipi/II/V/2026',
      submitLaporan: 'Belum',
      allocation: {
        operasionalProgramMitra: 73512,
        programNasional: 0,
        pemberdayaan: 0,
        sosialTrip: 0
      },
      realization: {
        sdmProgram: 0,
        operasional: 73512,
        profil: 0,
        total: 73512
      }
    });
    assert(status === 201, `Expected 201, got ${status}: ${JSON.stringify(data)}`);
    assert(data.data.allocation, 'Should include allocation');
    assert(data.data.realization, 'Should include realization');
  });

  await test('TC-34: Create DSS Record Duplicate', async () => {
    const { status } = await api('POST', '/dss-records', {
      campaignId,
      dss: 100
    });
    assert(status === 409, `Expected 409, got ${status}`);
  });

  await test('TC-35: Get DSS Record by Campaign ID', async () => {
    const { status, data } = await api('GET', `/dss-records/campaign/${campaignId}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.data.allocation, 'Should include allocation');
    assert(data.data.realization, 'Should include realization');
  });

  await test('TC-36: Update DSS Record (nested upsert)', async () => {
    const { status, data } = await api('PUT', `/dss-records/campaign/${campaignId}`, {
      submitLaporan: 'Sudah',
      allocation: {
        operasionalProgramMitra: 80000
      },
      realization: {
        total: 80000
      }
    });
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(data)}`);
  });

  await test('TC-37: Delete DSS Record (cascade)', async () => {
    const { status } = await api('DELETE', `/dss-records/campaign/${campaignId}`);
    assert(status === 200, `Expected 200, got ${status}`);
    // Verify it's gone
    const check = await api('GET', `/dss-records/campaign/${campaignId}`);
    assert(check.status === 404, 'DSS Record should be deleted');
  });

  // Phase 9: Cascade Check
  console.log('\n📌 Phase 9: Cascade & Cleanup');

  await test('TC-43: Delete Campaign (cascade to DSS)', async () => {
    // First create a new DSS record for the campaign
    await api('POST', '/dss-records', {
      campaignId,
      dss: 50000,
      submitLaporan: 'Belum'
    });

    // Delete campaign
    const { status } = await api('DELETE', `/campaigns/${campaignId}`);
    assert(status === 200, `Expected 200, got ${status}`);

    // Verify DSS record is also gone
    const check = await api('GET', `/dss-records/campaign/${campaignId}`);
    assert(check.status === 404, 'DSS Record should be cascade deleted');
  });

  // Cleanup: Delete test master data
  console.log('\n📌 Phase 10: Cleanup');

  await test('TC-44: Delete Product', async () => {
    const { status } = await api('DELETE', `/products/${productId}`);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('TC-45: Delete Platform', async () => {
    const { status } = await api('DELETE', `/platforms/${platformId}`);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('TC-46: Delete Contributor', async () => {
    const { status } = await api('DELETE', `/contributors/${contributorId}`);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('TC-47: Delete Beneficiary', async () => {
    const { status } = await api('DELETE', `/beneficiaries/${beneficiaryId}`);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('TC-48: Delete Program Category', async () => {
    const { status } = await api('DELETE', `/program-categories/${categoryId}`);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  // ========== SUMMARY ==========
  console.log('\n================================');
  console.log(`\n📊 Results: ${results.passed} passed, ${results.failed} failed`);
  if (results.errors.length > 0) {
    console.log('\n❌ Failures:');
    results.errors.forEach(e => console.log(`   - ${e.name}: ${e.error}`));
  }
  console.log('');

  process.exit(results.failed > 0 ? 1 : 0);
};

runTests().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});

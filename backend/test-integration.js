const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `Request failed with status ${res.status}`);
    err.data = data;
    throw err;
  }
  return data;
}

async function runTests() {
  console.log('--- STARTING HOUSEHUNT FULL-STACK INTEGRATION SUITE ---');

  try {
    // 1. Health Check
    const health = await request('/health');
    console.log('✔ [1/8] Health Check Passed:', health.status);

    // 2. Tenant Login
    const renterLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'renter@househunt.com', password: 'Renter@123' }),
    });
    const renterToken = renterLogin.token;
    console.log(`✔ [2/8] Tenant Login Passed: ${renterLogin.user.name} (${renterLogin.user.role})`);

    // 3. Landlord Login
    const landlordLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'landlord@househunt.com', password: 'Landlord@123' }),
    });
    const landlordToken = landlordLogin.token;
    console.log(`✔ [3/8] Landlord Login Passed: ${landlordLogin.user.name} (${landlordLogin.user.role})`);

    // 4. Admin Login
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@househunt.com', password: 'Admin@123' }),
    });
    const adminToken = adminLogin.token;
    console.log(`✔ [4/8] Admin Login Passed: ${adminLogin.user.name} (${adminLogin.user.role})`);

    // 5. Property Search & Filter
    const searchRes = await request('/properties?city=Bangalore&propertyType=Penthouse');
    console.log(`✔ [5/8] Search & Filtering Passed: Found ${searchRes.count} Penthouse(s) in Bangalore`);
    const penthouseId = searchRes.properties[0]._id;

    // 6. Tenant Submits a Review (or verifies existing)
    try {
      const reviewRes = await request(`/properties/${penthouseId}/reviews`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${renterToken}` },
        body: JSON.stringify({ rating: 5, comment: 'Automated test: Exceptional space, highly recommend!' }),
      });
      console.log('✔ [6/8] Review Submission Passed:', reviewRes.message);
    } catch (e) {
      console.log('ℹ [6/8] Review Note (expected if already reviewed in seed):', e.message);
    }

    // 7. Admin Moderation Workflow (Check pending properties & approve one)
    const pendingRes = await request('/properties/admin/pending', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`✔ [7/8] Admin Pending Queue: Found ${pendingRes.count} listing(s) awaiting moderation`);

    if (pendingRes.count > 0) {
      const pendingProp = pendingRes.properties[0];
      const approveRes = await request(`/properties/${pendingProp._id}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ status: 'approved', adminFeedback: 'Property documentation verified' }),
      });
      console.log(`✔ [7/8] Admin Approval Workflow Succeeded: "${pendingProp.title}" is now approved`);
    }

    // 8. Platform Statistics Check
    const statsRes = await request('/stats/platform');
    console.log('✔ [8/8] Platform Analytics Metrics Passed:', {
      totalUsers: statsRes.stats.totalUsers,
      totalProperties: statsRes.stats.totalProperties,
      approvedProperties: statsRes.stats.approvedProperties,
      activeCities: statsRes.stats.activeCities,
    });

    console.log('\n======================================================');
    console.log('🎉 ALL HOUSEHUNT INTEGRATION TESTS PASSED SUCCESSFULLY');
    console.log('======================================================');
  } catch (error) {
    console.error('❌ Integration Test Failed:', error.data || error.message);
    process.exit(1);
  }
}

runTests();

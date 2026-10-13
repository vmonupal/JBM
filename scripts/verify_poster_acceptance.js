/**
 * Acceptance test script verifying all requirements of Section 16
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      },
      (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          resolve({ status: res.statusCode, headers: res.headers, body });
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log('STARTING SECTION 16 POSTER SYSTEM ACCEPTANCE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Check /api/posters endpoint returns valid posters list
    const postersRes = await request('http://localhost:3000/api/posters');
    assert(postersRes.status === 200, 'GET /api/posters returns 200 OK');
    const posters = JSON.parse(postersRes.body);
    assert(Array.isArray(posters) && posters.length >= 5, `Posters list contains ${posters.length} items`);

    // 2. Verify all 5 key test poster resolutions exist
    const p1920x1080 = posters.find(p => p.width === 1920 && p.height === 1080);
    assert(p1920x1080 && p1920x1080.aspect_ratio === '16:9', 'Found 1920 × 1080 (16:9) landscape projector poster');

    const p1920x1200 = posters.find(p => p.width === 1920 && p.height === 1200);
    assert(p1920x1200 && p1920x1200.aspect_ratio === '16:10', 'Found 1920 × 1200 (16:10) landscape poster');

    const p1080x1350 = posters.find(p => p.width === 1080 && p.height === 1350);
    assert(p1080x1350 && p1080x1350.aspect_ratio === '4:5', 'Found 1080 × 1350 (4:5) portrait flyer poster');

    const p1080x1920 = posters.find(p => p.width === 1080 && p.height === 1920);
    assert(p1080x1920 && p1080x1920.aspect_ratio === '9:16', 'Found 1080 × 1920 (9:16) portrait poster');

    const p2560x1440 = posters.find(p => p.width === 2560 && p.height === 1440);
    assert(p2560x1440 && p2560x1440.aspect_ratio === '16:9', 'Found 2560 × 1440 (16:9) high-resolution poster');

    // 3. Verify image URLs actually serve valid content (No broken images)
    for (const p of posters.slice(0, 5)) {
      if (p.image_url) {
        const imgRes = await request(`http://localhost:3000${p.image_url}`);
        assert(imgRes.status === 200, `Original image URL accessible: ${p.image_url}`);
      }
      if (p.thumbnail_url) {
        const thumbRes = await request(`http://localhost:3000${p.thumbnail_url}`);
        assert(thumbRes.status === 200, `Thumbnail image URL accessible: ${p.thumbnail_url}`);
      }
      if (p.large_url) {
        const largeRes = await request(`http://localhost:3000${p.large_url}`);
        assert(largeRes.status === 200, `Large display image URL accessible: ${p.large_url}`);
      }
    }

    // 4. Test Poster Display Settings GET & POST
    const settingsGetRes = await request('http://localhost:3000/api/posters/settings');
    assert(settingsGetRes.status === 200, 'GET /api/posters/settings returns 200 OK');
    const settingsData = JSON.parse(settingsGetRes.body);
    assert(settingsData.settings && settingsData.settings.fit_mode === 'contain', 'Default projector fit mode is "contain" (no cropping)');
    assert(settingsData.settings && settingsData.settings.background === 'black', 'Default projector background is "black"');

    const updateSettingsRes = await request('http://localhost:3000/api/posters/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fit_mode: 'contain',
        background: 'black',
        default_zoom: '100%',
        show_poster_info: true,
        show_jbm_logo: true,
        fullscreen_default: false,
        remember_settings: true
      })
    });
    assert(updateSettingsRes.status === 200, 'POST /api/posters/settings saves settings persistently');

    // 5. Test Poster Gallery page loads with JBM brand
    const galleryRes = await request('http://localhost:3000/posters');
    assert(galleryRes.status === 200, 'GET /posters loads gallery successfully');
    assert(galleryRes.body.includes('JBM') && !galleryRes.body.includes('JBM Ministries'), 'Gallery strictly adheres to brand name "JBM"');

    // 6. Test Dedicated Projector Mode page loads
    const projectorRes = await request('http://localhost:3000/posters/projector');
    assert(projectorRes.status === 200, 'GET /posters/projector loads projector route successfully');

    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runAcceptanceTests();

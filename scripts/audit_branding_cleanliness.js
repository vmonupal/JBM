async function testRenderedHtml() {
  const routes = ['/', '/posters', '/bible', '/bible/projector', '/songs/projector', '/owner', '/about', '/contact'];
  const banned = ['JBM Ministries', 'JBM Ministry', 'JBM Church', 'JBM Fellowship', 'JBM Chapel', 'Jesus Before Me', 'Revival Chapel'];

  let allClean = true;
  for (const r of routes) {
    const res = await fetch('http://localhost:3000' + r);
    const html = await res.text();
    let found = false;
    for (const b of banned) {
      if (html.includes(b)) {
        console.error('[FAIL] Found "' + b + '" in route ' + r);
        found = true;
        allClean = false;
      }
    }
    if (!found) {
      console.log('[PASS] Route ' + r + ' is 100% clean of all banned terms (HTTP ' + res.status + ')');
    }
  }

  if (allClean) {
    console.log('\n======================================================');
    console.log(' ALL ROUTES VERIFIED: 100% CLEAN OF EXPANDED BRANDING!');
    console.log('======================================================');
  } else {
    process.exit(1);
  }
}

testRenderedHtml();

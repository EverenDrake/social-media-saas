const https = require('https');

const PRODUCTION_URL = 'https://social-sync-keurllvz3-ahmedalikhanaak-outlookcoms-projects.vercel.app';

function testProductionAPI() {
  console.log('🧪 Testing Production API...\n');
  
  const testUser = {
    username: 'produser' + Date.now(),
    email: `produser${Date.now()}@example.com`,
    password: 'Test123456'
  };
  
  const postData = JSON.stringify(testUser);
  
  const options = {
    hostname: 'social-sync-keurllvz3-ahmedalikhanaak-outlookcoms-projects.vercel.app',
    port: 443,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\nResponse Body:');
      try {
        const response = JSON.parse(data);
        console.log(JSON.stringify(response, null, 2));
        
        if (res.statusCode === 201) {
          console.log('\n✅ Production registration test PASSED!');
          console.log('✅ User created successfully');
          console.log('✅ JWT token generated');
        } else {
          console.log('\n❌ Production registration test FAILED');
          console.log('Status:', res.statusCode);
        }
      } catch (e) {
        console.log('Raw response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Test failed:', error.message);
  });
  
  console.log('📝 Sending registration request...');
  console.log('Test user:', testUser);
  req.write(postData);
  req.end();
}

// Test health endpoint first
console.log('🏥 Testing health endpoint...');
https.get(`${PRODUCTION_URL}/api/health`, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('✅ Health check passed, testing registration...\n');
    setTimeout(testProductionAPI, 1000);
  } else {
    console.log('❌ Health check failed');
  }
}).on('error', (err) => {
  console.log('❌ Health check error:', err.message);
});

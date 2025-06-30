const axios = require('axios');

async function testRegistration() {
  const testUsers = [
    {
      username: 'testuser1',
      email: 'test1@example.com',
      password: 'Test123456'
    },
    {
      username: 'invalid-email',
      email: 'not-an-email',
      password: 'Test123456'
    },
    {
      username: 'tu',
      email: 'test2@example.com',
      password: 'Test123456'
    },
    {
      username: 'testuser3',
      email: 'test3@example.com',
      password: '123' // Too short
    }
  ];

  const API_BASE_URL = 'http://localhost:5000/api';

  console.log('🧪 Testing Registration API...\n');

  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    console.log(`Test ${i + 1}: ${user.username} (${user.email})`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, user);
      console.log('✅ Success:', response.data.message);
      console.log('   User ID:', response.data.user.id);
      console.log('   Token received:', !!response.data.token);
    } catch (error) {
      if (error.response) {
        console.log('❌ Error:', error.response.data.message);
        if (error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            console.log('   -', err.msg);
          });
        }
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    
    console.log('');
  }

  // Test duplicate registration
  console.log('Test 5: Duplicate registration (testuser1)');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUsers[0]);
    console.log('✅ Success:', response.data.message);
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data.message);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }

  console.log('\n🏁 Registration tests completed!');
}

testRegistration().catch(console.error);

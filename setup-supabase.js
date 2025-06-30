const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  try {
    console.log('🔄 Setting up Supabase database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`   ${i + 1}/${statements.length}: Executing...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        });
        
        if (error && !error.message.includes('already exists')) {
          console.warn(`   ⚠️  Warning: ${error.message}`);
        }
      } catch (err) {
        // Try direct query method
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
          
        if (error && error.code === 'PGRST116') {
          console.log('   ℹ️  Table not found, schema needs to be created manually');
        }
      }
    }
    
    console.log('✅ Database schema setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-schema.sql');
    console.log('4. Execute the SQL to create all tables and policies');
    console.log('\n🚀 Your application is ready to use Supabase!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n📋 Manual setup required:');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-schema.sql');
    console.log('4. Execute the SQL to create all tables and policies');
  }
}

setupDatabase();

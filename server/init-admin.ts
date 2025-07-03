import { storage } from "./storage";

async function initializeAdmin() {
  try {
    // Check if running with database storage
    if (storage.constructor.name === 'MemStorage') {
      console.log('❌ Admin initialization skipped - MemStorage mode');
      console.log('Switch to DatabaseStorage to enable admin features');
      return;
    }

    console.log('🔧 Initializing admin user...');
    
    // Create default admin user
    const defaultAdmin = await storage.createAdmin(
      'admin',
      'admin123',
      'admin@textilehome.com'
    );
    
    console.log('✅ Admin user created successfully:');
    console.log(`   Username: admin`);
    console.log(`   Password: admin123`);
    console.log(`   Email: admin@textilehome.com`);
    console.log('');
    console.log('🔒 IMPORTANT: Change the password after first login!');
    console.log('   Access admin at: /admin');
    
  } catch (error: any) {
    if (error.message?.includes('duplicate key value')) {
      console.log('ℹ️  Admin user already exists');
      console.log('   Username: admin');
      console.log('   Access admin at: /admin');
    } else {
      console.error('❌ Failed to create admin user:', error.message);
    }
  }
}

// Run if called directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  initializeAdmin().then(() => process.exit(0));
}

export { initializeAdmin };
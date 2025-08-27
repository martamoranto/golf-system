#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Validates environment configuration for Final Golf SaaS
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bright: '\x1b[1m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Environment validation schemas
const envSchemas = {
  'apps/web': {
    required: [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_API_URL'
    ],
    optional: [
      'GOOGLE_CLIENT_ID',
      'PAYMONGO_PUBLIC_KEY',
      'STRIPE_PUBLIC_KEY',
      'S3_ENDPOINT'
    ],
    security: [
      { key: 'NEXTAUTH_SECRET', minLength: 32, description: 'NextAuth encryption secret' }
    ]
  },
  
  'apps/api': {
    required: [
      'DATABASE_URL',
      'JWT_SECRET',
      'REDIS_URL',
      'PORT'
    ],
    optional: [
      'PAYMONGO_SECRET_KEY',
      'STRIPE_SECRET_KEY',
      'CORS_ORIGINS',
      'S3_ENDPOINT'
    ],
    security: [
      { key: 'JWT_SECRET', minLength: 32, description: 'JWT signing secret' },
      { key: 'SESSION_SECRET', minLength: 32, description: 'Express session secret' }
    ],
    urls: [
      { key: 'DATABASE_URL', pattern: /^postgresql:\/\/.+/, description: 'PostgreSQL connection string' },
      { key: 'REDIS_URL', pattern: /^redis:\/\/.+/, description: 'Redis connection string' }
    ]
  },
  
  'apps/onsite-pwa': {
    required: [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_API_URL'
    ],
    optional: [
      'PAYMENT_TERMINAL_IP',
      'RECEIPT_PRINTER_IP',
      'ENABLE_OFFLINE_MODE'
    ],
    security: [
      { key: 'NEXTAUTH_SECRET', minLength: 32, description: 'NextAuth encryption secret' }
    ]
  },
  
  'apps/course-admin': {
    required: [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_API_URL'
    ],
    optional: [
      'ADMIN_ROLES',
      'REPORT_CACHE_TTL_MINUTES',
      'WEATHER_API_KEY'
    ],
    security: [
      { key: 'NEXTAUTH_SECRET', minLength: 32, description: 'NextAuth encryption secret' }
    ]
  },
  
  'apps/platform-admin': {
    required: [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_API_URL'
    ],
    optional: [
      'SUPER_ADMIN_EMAIL',
      'STRIPE_SECRET_KEY',
      'MFA_REQUIRED'
    ],
    security: [
      { key: 'NEXTAUTH_SECRET', minLength: 32, description: 'NextAuth encryption secret' }
    ]
  },
  
  'services/worker': {
    required: [
      'DATABASE_URL',
      'REDIS_URL'
    ],
    optional: [
      'SMTP_HOST',
      'SMS_PROVIDER',
      'QUEUE_EMAIL_CONCURRENCY'
    ],
    security: [
      { key: 'PAYMONGO_SECRET_KEY', minLength: 20, description: 'PayMongo secret key' },
      { key: 'STRIPE_SECRET_KEY', minLength: 20, description: 'Stripe secret key' }
    ]
  },
  
  'services/webhooks': {
    required: [
      'DATABASE_URL',
      'REDIS_URL',
      'PORT'
    ],
    optional: [
      'PAYMONGO_WEBHOOK_SECRET',
      'STRIPE_WEBHOOK_SECRET',
      'WEBHOOK_TIMEOUT_SECONDS'
    ],
    security: [
      { key: 'PAYMONGO_WEBHOOK_SECRET', minLength: 32, description: 'PayMongo webhook secret' },
      { key: 'STRIPE_WEBHOOK_SECRET', minLength: 32, description: 'Stripe webhook secret' }
    ]
  },
  
  'services/scheduler': {
    required: [
      'DATABASE_URL',
      'REDIS_URL'
    ],
    optional: [
      'CRON_TIMEZONE',
      'HOLD_CLEANUP_CRON',
      'BOOKING_REMINDER_CRON'
    ],
    security: []
  },
  
  'services/realtime': {
    required: [
      'DATABASE_URL',
      'REDIS_URL',
      'PORT'
    ],
    optional: [
      'JWT_SECRET',
      'MAX_CONNECTIONS',
      'SOCKET_IO_CORS_ORIGINS'
    ],
    security: [
      { key: 'JWT_SECRET', minLength: 32, description: 'JWT signing secret' }
    ]
  }
};

// Validation functions
function validateRequired(env, required) {
  const missing = [];
  required.forEach(key => {
    if (!env[key] || env[key].trim() === '') {
      missing.push(key);
    }
  });
  return missing;
}

function validateSecurity(env, security) {
  const issues = [];
  security.forEach(({ key, minLength, description }) => {
    if (env[key]) {
      if (env[key].length < minLength) {
        issues.push(`${key}: Too short (minimum ${minLength} characters) - ${description}`);
      }
      
      // Check for development defaults that should be changed
      const devDefaults = [
        'development-secret',
        'change-in-production',
        'your-secret-here',
        'admin123',
        'password123'
      ];
      
      if (devDefaults.some(def => env[key].toLowerCase().includes(def))) {
        issues.push(`${key}: Contains development placeholder - ${description}`);
      }
      
      // Entropy check for critical secrets
      if (key.includes('SECRET') || key.includes('JWT')) {
        const entropy = calculateEntropy(env[key]);
        if (entropy < 3.5) {
          issues.push(`${key}: Low entropy (${entropy.toFixed(2)}) - Consider using a stronger secret`);
        }
      }
    }
  });
  return issues;
}

function validateUrls(env, urls) {
  const issues = [];
  urls.forEach(({ key, pattern, description }) => {
    if (env[key] && !pattern.test(env[key])) {
      issues.push(`${key}: Invalid format - ${description}`);
    }
  });
  return issues;
}

function calculateEntropy(str) {
  const freq = {};
  str.split('').forEach(char => {
    freq[char] = (freq[char] || 0) + 1;
  });
  
  const len = str.length;
  return Object.values(freq).reduce((entropy, count) => {
    const p = count / len;
    return entropy - p * Math.log2(p);
  }, 0);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
  
  return env;
}

function validateEnvironment(servicePath, schema) {
  log('blue', `\\n📋 Validating ${servicePath}...`);
  
  // Check for .env file
  const envPaths = [
    path.join(servicePath, '.env'),
    path.join(servicePath, '.env.local'),
    path.join(servicePath, '.env.development')
  ];
  
  let env = null;
  let envFile = null;
  
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      env = loadEnvFile(envPath);
      envFile = envPath;
      break;
    }
  }
  
  if (!env) {
    log('yellow', `  ⚠️  No environment file found. Checked: ${envPaths.map(p => path.basename(p)).join(', ')}`);
    return false;
  }
  
  log('cyan', `  📄 Using: ${path.basename(envFile)}`);
  
  let hasErrors = false;
  
  // Validate required variables
  const missing = validateRequired(env, schema.required);
  if (missing.length > 0) {
    log('red', `  ❌ Missing required variables:`);
    missing.forEach(key => log('red', `     - ${key}`));
    hasErrors = true;
  } else {
    log('green', `  ✅ All required variables present (${schema.required.length})`);
  }
  
  // Validate security settings
  if (schema.security && schema.security.length > 0) {
    const securityIssues = validateSecurity(env, schema.security);
    if (securityIssues.length > 0) {
      log('yellow', `  ⚠️  Security warnings:`);
      securityIssues.forEach(issue => log('yellow', `     - ${issue}`));
    } else {
      log('green', `  🔒 Security validation passed`);
    }
  }
  
  // Validate URL formats
  if (schema.urls) {
    const urlIssues = validateUrls(env, schema.urls);
    if (urlIssues.length > 0) {
      log('red', `  ❌ URL format errors:`);
      urlIssues.forEach(issue => log('red', `     - ${issue}`));
      hasErrors = true;
    }
  }
  
  // Check optional variables
  const presentOptional = schema.optional.filter(key => env[key]);
  if (presentOptional.length > 0) {
    log('cyan', `  ℹ️  Optional variables configured: ${presentOptional.length}/${schema.optional.length}`);
  }
  
  return !hasErrors;
}

function generateSecrets() {
  log('magenta', '\\n🔑 Generated secure secrets:');
  log('white', '-----------------------------------');
  
  console.log('# JWT and session secrets');
  console.log(`JWT_SECRET="${crypto.randomBytes(32).toString('base64')}"`);
  console.log(`NEXTAUTH_SECRET="${crypto.randomBytes(32).toString('base64')}"`);
  console.log(`SESSION_SECRET="${crypto.randomBytes(32).toString('base64')}"`);
  
  console.log('\\n# Webhook secrets');
  console.log(`PAYMONGO_WEBHOOK_SECRET="${crypto.randomBytes(32).toString('hex')}"`);
  console.log(`STRIPE_WEBHOOK_SECRET="${crypto.randomBytes(32).toString('hex')}"`);
  
  console.log('\\n# Additional secrets');
  console.log(`WEBHOOK_SECRET="${crypto.randomBytes(24).toString('base64')}"`);
  console.log(`ENCRYPTION_KEY="${crypto.randomBytes(32).toString('hex')}"`);
  
  log('white', '-----------------------------------');
  log('magenta', 'Copy these to your environment files and replace the development defaults.');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--generate-secrets')) {
    generateSecrets();
    return;
  }
  
  log('bright', '🔍 Final Golf SaaS - Environment Validation');
  log('white', '==========================================');
  
  const rootPath = process.cwd();
  let allValid = true;
  let servicesChecked = 0;
  
  // Validate each service
  Object.entries(envSchemas).forEach(([servicePath, schema]) => {
    const fullPath = path.join(rootPath, servicePath);
    
    if (fs.existsSync(fullPath)) {
      const isValid = validateEnvironment(fullPath, schema);
      if (!isValid) {
        allValid = false;
      }
      servicesChecked++;
    } else {
      log('yellow', `\\n⚠️  Service directory not found: ${servicePath}`);
    }
  });
  
  // Summary
  log('white', '\\n==========================================');
  if (allValid) {
    log('green', `✅ Environment validation passed for all ${servicesChecked} services!`);
  } else {
    log('red', `❌ Environment validation failed for some services.`);
    log('white', '\\nTo fix issues:');
    log('white', '1. Copy .env.example files to .env files');
    log('white', '2. Fill in required values');
    log('white', '3. Generate secure secrets with: npm run env:generate-secrets');
    log('white', '4. Re-run validation with: npm run env:validate');
  }
  
  // Additional recommendations
  log('white', '\\n💡 Additional recommendations:');
  log('cyan', '• Use npm run env:generate-secrets for production secrets');
  log('cyan', '• Set up monitoring with Sentry DSN in production');
  log('cyan', '• Configure real SMTP credentials for email functionality');
  log('cyan', '• Set up payment provider credentials for transaction processing');
  
  process.exit(allValid ? 0 : 1);
}

// Error handling
process.on('uncaughtException', (error) => {
  log('red', `Fatal error: ${error.message}`);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = { validateEnvironment, generateSecrets };
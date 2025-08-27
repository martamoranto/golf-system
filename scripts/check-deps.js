#!/usr/bin/env node
/**
 * Dependency Health Check Script
 * Analyzes workspace dependencies and identifies potential issues
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkOutdatedDependencies() {
  log('\n📦 Checking for outdated dependencies...', 'blue')
  
  try {
    const result = execSync('pnpm outdated -r --format=json', { encoding: 'utf8' })
    const outdated = JSON.parse(result)
    
    if (Object.keys(outdated).length === 0) {
      log('✅ All dependencies are up to date', 'green')
    } else {
      log('⚠️  Found outdated dependencies:', 'yellow')
      Object.entries(outdated).forEach(([pkg, info]) => {
        log(`  ${pkg}: ${info.current} → ${info.latest}`, 'yellow')
      })
      log('\nRun "pnpm workspace:update" to update all dependencies', 'blue')
    }
  } catch (error) {
    // pnpm outdated exits with code 1 when outdated deps found
    if (error.stdout) {
      log('⚠️  Some dependencies are outdated', 'yellow')
      log('Run "pnpm outdated -r" for details', 'blue')
    } else {
      log('❌ Failed to check outdated dependencies', 'red')
    }
  }
}

function checkSecurityVulnerabilities() {
  log('\n🔒 Checking for security vulnerabilities...', 'blue')
  
  try {
    execSync('pnpm audit --prod', { stdio: 'pipe' })
    log('✅ No security vulnerabilities found in production dependencies', 'green')
  } catch (error) {
    log('⚠️  Security vulnerabilities detected', 'yellow')
    log('Run "pnpm audit" for details and "pnpm audit --fix" to fix automatically', 'blue')
  }
}

function checkWorkspaceStructure() {
  log('\n🏗️  Analyzing workspace structure...', 'blue')
  
  try {
    const result = execSync('pnpm list -r --depth=0 --json', { encoding: 'utf8' })
    const packages = JSON.parse(result)
    
    const apps = packages.filter(pkg => pkg.path.includes('/apps/'))
    const packagesDir = packages.filter(pkg => pkg.path.includes('/packages/'))
    const services = packages.filter(pkg => pkg.path.includes('/services/'))
    
    log(`📱 Apps: ${apps.length}`, apps.length > 0 ? 'green' : 'yellow')
    apps.forEach(app => log(`  - ${app.name}`, 'blue'))
    
    log(`📦 Packages: ${packagesDir.length}`, packagesDir.length > 0 ? 'green' : 'yellow')
    packagesDir.forEach(pkg => log(`  - ${pkg.name}`, 'blue'))
    
    log(`⚙️  Services: ${services.length}`, services.length > 0 ? 'green' : 'yellow')
    services.forEach(service => log(`  - ${service.name}`, 'blue'))
    
  } catch (error) {
    log('❌ Failed to analyze workspace structure', 'red')
  }
}

function checkDuplicateDependencies() {
  log('\n🔍 Checking for duplicate dependencies...', 'blue')
  
  try {
    const result = execSync('pnpm list -r --depth=0 --json', { encoding: 'utf8' })
    const packages = JSON.parse(result)
    
    const allDeps = new Map()
    const duplicates = new Map()
    
    packages.forEach(pkg => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(pkg.path, 'package.json'), 'utf8'))
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      Object.entries(deps).forEach(([name, version]) => {
        if (!allDeps.has(name)) {
          allDeps.set(name, new Set())
        }
        allDeps.get(name).add(version)
        
        if (allDeps.get(name).size > 1) {
          if (!duplicates.has(name)) {
            duplicates.set(name, new Set())
          }
          duplicates.get(name).add(`${pkg.name}: ${version}`)
        }
      })
    })
    
    if (duplicates.size === 0) {
      log('✅ No duplicate dependencies with different versions found', 'green')
    } else {
      log('⚠️  Found dependencies with multiple versions:', 'yellow')
      duplicates.forEach((packages, depName) => {
        log(`  ${depName}:`, 'yellow')
        packages.forEach(pkg => log(`    ${pkg}`, 'yellow'))
      })
      log('\nConsider using pnpm overrides or catalog to manage versions', 'blue')
    }
  } catch (error) {
    log('❌ Failed to check duplicate dependencies', 'red')
  }
}

function checkTypeScriptReferences() {
  log('\n🔷 Checking TypeScript project references...', 'blue')
  
  const requiredConfigs = [
    'tsconfig.base.json',
    'tsconfig.build.json',
    'apps/web/tsconfig.json',
    'packages/shared/tsconfig.json'
  ]
  
  let allValid = true
  
  requiredConfigs.forEach(config => {
    if (fs.existsSync(config)) {
      try {
        JSON.parse(fs.readFileSync(config, 'utf8'))
        log(`✅ ${config} is valid`, 'green')
      } catch (error) {
        log(`❌ ${config} has invalid JSON`, 'red')
        allValid = false
      }
    } else {
      log(`⚠️  ${config} not found`, 'yellow')
    }
  })
  
  if (allValid) {
    log('✅ TypeScript configuration appears healthy', 'green')
  }
}

function main() {
  log('🏌️ Final Golf SaaS - Dependency Health Check', 'blue')
  log('===========================================', 'blue')
  
  checkWorkspaceStructure()
  checkOutdatedDependencies()
  checkSecurityVulnerabilities()
  checkDuplicateDependencies()
  checkTypeScriptReferences()
  
  log('\n📊 Health Check Complete', 'magenta')
  log('Review any warnings above and take appropriate action.', 'blue')
}

main()
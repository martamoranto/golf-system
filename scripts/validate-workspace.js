#!/usr/bin/env node
/**
 * Workspace Validation Script
 * Validates the monorepo structure and dependencies
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Colors for console output
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

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath)
  if (exists) {
    log(`✅ ${description}`, 'green')
  } else {
    log(`❌ ${description} (${filePath})`, 'red')
  }
  return exists
}

function checkDirectory(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
  if (exists) {
    log(`✅ ${description}`, 'green')
  } else {
    log(`❌ ${description} (${dirPath})`, 'red')
  }
  return exists
}

function runCommand(command, description) {
  try {
    execSync(command, { stdio: 'pipe' })
    log(`✅ ${description}`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description}`, 'red')
    log(`   Error: ${error.message}`, 'red')
    return false
  }
}

function main() {
  log('🏌️ Final Golf SaaS - Workspace Validation', 'blue')
  log('=========================================', 'blue')
  
  let allChecks = true

  // Check root files
  log('\n📁 Root Configuration:', 'yellow')
  allChecks &= checkFile('package.json', 'Root package.json exists')
  allChecks &= checkFile('pnpm-workspace.yaml', 'PNPM workspace configuration exists')
  allChecks &= checkFile('turbo.json', 'Turborepo configuration exists')
  allChecks &= checkFile('tsconfig.base.json', 'Base TypeScript configuration exists')
  allChecks &= checkFile('tsconfig.build.json', 'Build TypeScript configuration exists')

  // Check directories
  log('\n📂 Directory Structure:', 'yellow')
  allChecks &= checkDirectory('apps', 'Apps directory exists')
  allChecks &= checkDirectory('packages', 'Packages directory exists')
  allChecks &= checkDirectory('services', 'Services directory exists')

  // Check workspace packages
  log('\n📦 Workspace Packages:', 'yellow')
  try {
    const workspaceInfo = execSync('pnpm list -r --depth=0 --json', { encoding: 'utf8' })
    const packages = JSON.parse(workspaceInfo)
    
    if (packages.length > 1) {
      log(`✅ Found ${packages.length} workspace packages`, 'green')
      packages.forEach(pkg => {
        if (pkg.name !== 'final-golf-saas') {
          log(`  - ${pkg.name} (${pkg.path})`, 'blue')
        }
      })
    } else {
      log(`⚠️  Only root package found, workspace packages may not be set up yet`, 'yellow')
    }
  } catch (error) {
    log(`❌ Failed to list workspace packages`, 'red')
    allChecks = false
  }

  // Check TypeScript configuration
  log('\n🔷 TypeScript Validation:', 'yellow')
  allChecks &= runCommand('npx tsc --noEmit --project tsconfig.base.json', 'Base TypeScript configuration is valid')

  // Check scripts
  log('\n⚙️ Script Validation:', 'yellow')
  const requiredScripts = [
    'dev', 'build', 'test', 'lint', 'type-check',
    'clean', 'db:generate', 'db:migrate', 'db:seed'
  ]
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const scripts = packageJson.scripts || {}
    
    requiredScripts.forEach(script => {
      if (scripts[script]) {
        log(`✅ Script "${script}" exists`, 'green')
      } else {
        log(`❌ Script "${script}" missing`, 'red')
        allChecks = false
      }
    })
  } catch (error) {
    log(`❌ Failed to validate scripts`, 'red')
    allChecks = false
  }

  // Check tools
  log('\n🛠️  Tools Validation:', 'yellow')
  allChecks &= runCommand('pnpm --version', 'PNPM is available')
  allChecks &= runCommand('npx turbo --version', 'Turborepo is available')
  allChecks &= runCommand('npx tsc --version', 'TypeScript is available')
  allChecks &= runCommand('npx prettier --version', 'Prettier is available')
  allChecks &= runCommand('npx eslint --version', 'ESLint is available')

  // Summary
  log('\n📊 Validation Summary:', 'magenta')
  if (allChecks) {
    log('🎉 All validation checks passed!', 'green')
    log('Your workspace is properly configured and ready for development.', 'green')
  } else {
    log('⚠️  Some validation checks failed.', 'yellow')
    log('Please review the errors above and fix them before proceeding.', 'yellow')
    process.exit(1)
  }
}

main()
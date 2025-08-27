#!/usr/bin/env node
/**
 * CI/CD Pipeline Validation Script
 * Validates GitHub Actions workflow configurations and dependencies
 * Ensures all required secrets, variables, and settings are properly configured
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml"); // Note: You'll need to install js-yaml: pnpm add -D js-yaml

// Configuration
const WORKFLOW_DIR = path.join(__dirname, "../.github/workflows");
const DOCS_DIR = path.join(__dirname, "../docs/generated");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

// Emoji symbols
const symbols = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
  rocket: "🚀",
  gear: "⚙️",
  shield: "🛡️",
  mag: "🔍",
};

/**
 * Print colored output to console
 */
function print(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printHeader(title) {
  print("");
  print("=".repeat(60), "cyan");
  print(`${symbols.gear} ${title}`, "cyan");
  print("=".repeat(60), "cyan");
}

/**
 * Print validation result
 */
function printResult(check, status, details = "") {
  const symbol = status ? symbols.success : symbols.error;
  const color = status ? "green" : "red";
  print(`${symbol} ${check}${details ? ": " + details : ""}`, color);
}

/**
 * Print warning
 */
function printWarning(message) {
  print(`${symbols.warning} ${message}`, "yellow");
}

/**
 * Print info
 */
function printInfo(message) {
  print(`${symbols.info} ${message}`, "blue");
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Read and parse YAML file
 */
function readYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content);
  } catch (error) {
    return null;
  }
}

/**
 * Read JSON file
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Get list of workflow files
 */
function getWorkflowFiles() {
  try {
    if (!fs.existsSync(WORKFLOW_DIR)) {
      return [];
    }
    return fs
      .readdirSync(WORKFLOW_DIR)
      .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
      .map((file) => path.join(WORKFLOW_DIR, file));
  } catch (error) {
    return [];
  }
}

/**
 * Validate workflow structure
 */
function validateWorkflowStructure() {
  printHeader("GitHub Actions Workflow Structure Validation");

  const workflowFiles = getWorkflowFiles();

  if (workflowFiles.length === 0) {
    printResult("Workflow directory exists", false, "No workflow files found");
    return false;
  }

  printResult(
    "Workflow directory exists",
    true,
    `${workflowFiles.length} files found`,
  );

  // Expected core workflows
  const expectedWorkflows = [
    "ci.yml",
    "cd-staging.yml",
    "cd-production.yml",
    "pr-validation.yml",
    "security-scan.yml",
    "cache-cleanup.yml",
  ];

  const expectedTemplates = [
    "_template-nodejs-setup.yml",
    "_template-quality-check.yml",
    "_template-build-deploy.yml",
  ];

  let allValid = true;

  // Check core workflows
  print("\n📋 Core Workflows:");
  expectedWorkflows.forEach((workflow) => {
    const workflowPath = path.join(WORKFLOW_DIR, workflow);
    const exists = fileExists(workflowPath);
    printResult(`  ${workflow}`, exists);
    if (!exists) allValid = false;
  });

  // Check template workflows
  print("\n🔧 Template Workflows:");
  expectedTemplates.forEach((template) => {
    const templatePath = path.join(WORKFLOW_DIR, template);
    const exists = fileExists(templatePath);
    printResult(`  ${template}`, exists);
    if (!exists) allValid = false;
  });

  return allValid;
}

/**
 * Validate workflow syntax and dependencies
 */
function validateWorkflowSyntax() {
  printHeader("Workflow Syntax and Dependencies Validation");

  const workflowFiles = getWorkflowFiles();
  let allValid = true;

  workflowFiles.forEach((workflowPath) => {
    const fileName = path.basename(workflowPath);
    const workflow = readYamlFile(workflowPath);

    if (!workflow) {
      printResult(`${fileName} - YAML syntax`, false, "Invalid YAML");
      allValid = false;
      return;
    }

    printResult(`${fileName} - YAML syntax`, true);

    // Check required workflow properties
    const requiredProps = ["name", "on"];
    const hasRequiredProps = requiredProps.every((prop) =>
      workflow.hasOwnProperty(prop),
    );
    printResult(`${fileName} - Required properties`, hasRequiredProps);
    if (!hasRequiredProps) allValid = false;

    // Check for jobs
    const hasJobs = workflow.jobs && Object.keys(workflow.jobs).length > 0;
    printResult(`${fileName} - Has jobs`, hasJobs);
    if (!hasJobs) allValid = false;

    // Check template dependencies
    if (fileName.startsWith("_template-")) {
      // Template workflows should have workflow_call trigger
      const hasWorkflowCall = workflow.on && workflow.on.workflow_call;
      printResult(`${fileName} - Template trigger`, hasWorkflowCall);
      if (!hasWorkflowCall) allValid = false;
    }
  });

  return allValid;
}

/**
 * Validate package.json scripts for CI/CD
 */
function validatePackageScripts() {
  printHeader("Package.json CI/CD Scripts Validation");

  const packageJsonPath = path.join(__dirname, "../package.json");
  const packageJson = readJsonFile(packageJsonPath);

  if (!packageJson) {
    printResult("package.json exists", false);
    return false;
  }

  printResult("package.json exists", true);

  // Expected CI/CD scripts
  const expectedScripts = [
    "ci:build",
    "ci:test",
    "ci:lint",
    "ci:type-check",
    "ci:validate",
    "build:production",
    "build:packages",
    "build:apps",
    "build:services",
  ];

  let allValid = true;

  print("\n📋 Required CI/CD Scripts:");
  expectedScripts.forEach((script) => {
    const exists = packageJson.scripts && packageJson.scripts[script];
    printResult(`  ${script}`, !!exists);
    if (!exists) allValid = false;
  });

  // Check for important dev dependencies
  const expectedDevDeps = [
    "@commitlint/cli",
    "husky",
    "lint-staged",
    "prettier",
    "turbo",
    "typescript",
  ];

  print("\n📦 Required Dev Dependencies:");
  expectedDevDeps.forEach((dep) => {
    const exists =
      packageJson.devDependencies && packageJson.devDependencies[dep];
    printResult(`  ${dep}`, !!exists);
    if (!exists) allValid = false;
  });

  return allValid;
}

/**
 * Validate Turborepo configuration
 */
function validateTurboConfig() {
  printHeader("Turborepo Configuration Validation");

  const turboConfigPath = path.join(__dirname, "../turbo.json");
  const turboConfig = readJsonFile(turboConfigPath);

  if (!turboConfig) {
    printResult("turbo.json exists", false);
    return false;
  }

  printResult("turbo.json exists", true);

  // Check pipeline configuration
  const hasPipeline =
    turboConfig.pipeline && Object.keys(turboConfig.pipeline).length > 0;
  printResult("Pipeline configuration", hasPipeline);

  let allValid = hasPipeline;

  if (hasPipeline) {
    // Expected pipeline tasks
    const expectedTasks = [
      "build",
      "dev",
      "lint",
      "type-check",
      "test",
      "clean",
    ];

    print("\n⚙️ Pipeline Tasks:");
    expectedTasks.forEach((task) => {
      const exists = turboConfig.pipeline[task];
      printResult(`  ${task}`, !!exists);
      if (!exists) allValid = false;
    });
  }

  return allValid;
}

/**
 * Validate environment and secrets documentation
 */
function validateDocumentation() {
  printHeader("CI/CD Documentation Validation");

  const expectedDocs = ["CICD_SETUP.md", "SECRETS_MANAGEMENT.md"];

  let allValid = true;

  expectedDocs.forEach((doc) => {
    const docPath = path.join(DOCS_DIR, doc);
    const exists = fileExists(docPath);
    printResult(doc, exists);
    if (!exists) allValid = false;

    if (exists) {
      try {
        const content = fs.readFileSync(docPath, "utf8");
        const hasContent = content.length > 1000; // Basic content check
        printResult(`${doc} - Has content`, hasContent);
        if (!hasContent) allValid = false;
      } catch (error) {
        printResult(`${doc} - Readable`, false);
        allValid = false;
      }
    }
  });

  return allValid;
}

/**
 * Validate Git configuration
 */
function validateGitConfig() {
  printHeader("Git Configuration Validation");

  // Check for important Git files
  const gitFiles = [
    ".gitignore",
    ".github/CODEOWNERS",
    ".github/branch-protection.yml",
    "commitlint.config.js",
  ];

  let allValid = true;

  gitFiles.forEach((file) => {
    const filePath = path.join(__dirname, "..", file);
    const exists = fileExists(filePath);
    printResult(file, exists);
    if (!exists) allValid = false;
  });

  // Check for Husky configuration
  const huskyDir = path.join(__dirname, "../.husky");
  const huskyExists = fs.existsSync(huskyDir);
  printResult(".husky directory", huskyExists);
  if (!huskyExists) allValid = false;

  if (huskyExists) {
    const huskyHooks = ["pre-commit", "commit-msg"];
    huskyHooks.forEach((hook) => {
      const hookPath = path.join(huskyDir, hook);
      const exists = fileExists(hookPath);
      printResult(`.husky/${hook}`, exists);
      if (!exists) allValid = false;
    });
  }

  return allValid;
}

/**
 * Generate validation summary
 */
function generateSummary(validations) {
  printHeader("CI/CD Validation Summary");

  const totalChecks = Object.keys(validations).length;
  const passedChecks = Object.values(validations).filter(Boolean).length;
  const failedChecks = totalChecks - passedChecks;

  print(`\n📊 Validation Results:`);
  print(`• Total Checks: ${totalChecks}`, "blue");
  print(`• Passed: ${passedChecks}`, passedChecks > 0 ? "green" : "red");
  print(`• Failed: ${failedChecks}`, failedChecks === 0 ? "green" : "red");

  const overallStatus = failedChecks === 0;
  print("");
  if (overallStatus) {
    print(`${symbols.success} Overall Status: CI/CD Pipeline Ready!`, "green");
    print(
      "🚀 Your CI/CD pipeline is properly configured and ready for use.",
      "green",
    );
  } else {
    print(`${symbols.error} Overall Status: Configuration Issues Found`, "red");
    print(
      "🛠️ Please address the failed checks before using the CI/CD pipeline.",
      "red",
    );
  }

  print("");
  print("📋 Next Steps:");
  if (overallStatus) {
    print("• Configure GitHub repository secrets");
    print("• Set up branch protection rules");
    print("• Test workflows with a sample PR");
    print("• Review deployment environment setup");
  } else {
    print("• Fix failed validation checks");
    print("• Re-run validation script");
    print("• Review CI/CD documentation");
    print("• Ask for help if needed");
  }

  return overallStatus;
}

/**
 * Main validation function
 */
function main() {
  print(
    `${symbols.rocket} Final Golf SaaS - CI/CD Pipeline Validation`,
    "bold",
  );
  print(
    `${symbols.mag} Validating GitHub Actions workflows and configuration...`,
    "blue",
  );

  // Run all validations
  const validations = {
    "Workflow Structure": validateWorkflowStructure(),
    "Workflow Syntax": validateWorkflowSyntax(),
    "Package Scripts": validatePackageScripts(),
    "Turbo Configuration": validateTurboConfig(),
    Documentation: validateDocumentation(),
    "Git Configuration": validateGitConfig(),
  };

  // Generate summary
  const overallSuccess = generateSummary(validations);

  // Exit with appropriate code
  process.exit(overallSuccess ? 0 : 1);
}

// Handle missing dependencies gracefully
try {
  require("js-yaml");
} catch (error) {
  print(`${symbols.error} Missing dependency: js-yaml`, "red");
  print("Please install it with: pnpm add -D js-yaml", "yellow");
  process.exit(1);
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = {
  validateWorkflowStructure,
  validateWorkflowSyntax,
  validatePackageScripts,
  validateTurboConfig,
  validateDocumentation,
  validateGitConfig,
};

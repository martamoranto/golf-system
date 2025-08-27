// Commitlint configuration for Final Golf SaaS
// Enforces conventional commits for consistent git history

module.exports = {
  extends: ["@commitlint/config-conventional"],

  // Custom rules for Final Golf SaaS
  rules: {
    // Type enum - allowed commit types
    "type-enum": [
      2,
      "always",
      [
        "feat", // New features
        "fix", // Bug fixes
        "docs", // Documentation changes
        "style", // Code style changes (formatting, etc.)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Build system or external dependencies
        "ci", // CI/CD changes
        "chore", // Maintenance tasks
        "revert", // Reverts a previous commit
        "wip", // Work in progress (avoid in main branches)
        "init", // Initial commit or setup
        "config", // Configuration changes
        "deps", // Dependency updates
        "security", // Security fixes or improvements
        "ui", // UI/UX changes
        "db", // Database related changes
        "api", // API related changes
        "docker", // Docker related changes
        "env", // Environment related changes
      ],
    ],

    // Scope enum - allowed scopes (optional but recommended)
    "scope-enum": [
      1,
      "always",
      [
        // Apps
        "web",
        "api",
        "onsite-pwa",
        "course-admin",
        "platform-admin",

        // Services
        "worker",
        "webhooks",
        "scheduler",
        "realtime",

        // Packages
        "database",
        "schemas",
        "types",
        "ui",
        "shared",
        "config",
        "auth",
        "payments",
        "notifications",
        "i18n",
        "analytics",

        // Infrastructure
        "docker",
        "ci",
        "deploy",
        "infra",
        "monitoring",

        // General
        "deps",
        "config",
        "scripts",
        "docs",
        "tests",
        "security",
        "performance",
        "accessibility",
        "seo",

        // Business domains
        "booking",
        "teesheet",
        "pos",
        "inventory",
        "reporting",
        "users",
        "courses",
        "payments",
        "notifications",
        "classifieds",
        "coaching",
        "loyalty",
        "tournaments",
      ],
    ],

    // Subject rules
    "subject-case": [2, "always", "sentence-case"],
    "subject-empty": [2, "never"],
    "subject-min-length": [2, "always", 10],
    "subject-max-length": [2, "always", 100],
    "subject-full-stop": [2, "never", "."],

    // Body rules
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 120],

    // Footer rules
    "footer-leading-blank": [2, "always"],
    "footer-max-line-length": [2, "always", 120],

    // Header rules
    "header-max-length": [2, "always", 120],
    "header-min-length": [2, "always", 20],

    // Type rules
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // Scope rules
    "scope-case": [2, "always", "lower-case"],
  },

  // Custom plugins (can be added for project-specific rules)
  plugins: [],

  // Help URL for commit message format
  helpUrl:
    "https://github.com/conventional-changelog/commitlint/#what-is-commitlint",

  // Custom formatters
  formatter: "@commitlint/format",

  // Default severity level
  defaultIgnores: true,

  // Ignore patterns
  ignores: [
    // Ignore merge commits
    (commit) => commit.includes("Merge"),
    // Ignore revert commits (they have their own format)
    (commit) => commit.includes("Revert"),
    // Ignore release commits
    (commit) => commit.includes("chore(release)"),
    // Ignore dependency update commits from bots
    (commit) => commit.includes("chore(deps)") && commit.includes("bump"),
  ],
};

// Example commit messages:
//
// ✅ Good examples:
// feat(booking): Add real-time availability checking
// fix(api): Resolve payment webhook timeout issue
// docs(readme): Update installation instructions
// refactor(database): Optimize booking query performance
// test(booking): Add integration tests for tee time slots
// chore(deps): Update dependencies to latest versions
//
// ❌ Bad examples:
// fix bug                          (too short, no scope)
// Add new feature                  (wrong format, no type)
// feat: fix                        (inconsistent, 'fix' should be type)
// FEAT(BOOKING): ADD FEATURE       (wrong case)
// feat(booking): add feature.      (ends with period)
//
// 📋 Full format:
// <type>[optional scope]: <description>
//
// [optional body]
//
// [optional footer(s)]

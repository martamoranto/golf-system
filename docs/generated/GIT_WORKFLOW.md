# 🔄 Git Workflow Guide

Complete guide for git workflow and development practices in Final Golf SaaS.

## 🚀 Quick Start

### Daily Development Workflow

```bash
# 1. Start from develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feat/booking-system-integration

# 3. Make changes and commit (commitlint will validate)
git add .
git commit -m "feat(booking): Add real-time availability updates"

# 4. Push and create PR
git push origin feat/booking-system-integration
gh pr create --title "feat(booking): Add real-time availability updates"
```

## 📋 Git Setup Checklist

### Initial Setup

```bash
# Install git hooks (already configured)
pnpm git:hooks

# Configure git identity (if not done)
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Optional: Enable commit signing
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_GPG_KEY
```

### Verify Setup

```bash
# Test commit message validation
echo "invalid message" | pnpm exec commitlint

# Test pre-commit hooks
git add . && git commit -m "test: Verify git hooks setup"
```

## 🎯 Conventional Commits

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples

#### ✅ Good Examples

```bash
git commit -m "feat(booking): Add real-time availability checking"
git commit -m "fix(api): Resolve payment webhook timeout issue"
git commit -m "docs(readme): Update installation instructions"
git commit -m "refactor(database): Optimize booking query performance"
git commit -m "test(booking): Add integration tests for tee time slots"
git commit -m "chore(deps): Update dependencies to latest versions"
```

#### ❌ Bad Examples

```bash
git commit -m "fix bug"                    # Too short, no scope
git commit -m "Add new feature"            # Wrong format, no type
git commit -m "feat: fix"                  # Inconsistent, 'fix' should be type
git commit -m "FEAT(BOOKING): ADD FEATURE" # Wrong case
git commit -m "feat(booking): add feature." # Ends with period
```

### Full Example with Body and Footer

```bash
git commit -m "feat(booking): Add real-time availability checking

Implement WebSocket connection for live tee sheet updates:
- Add booking conflict resolution
- Update UI to show real-time slot status
- Add proper error handling for connection issues

This improves user experience by preventing booking conflicts
and provides immediate feedback on slot availability.

Closes #123
Co-authored-by: Jane Smith <jane@company.com>"
```

## 🌿 Branch Strategy

### Branch Types

- **`main`** - Production releases (protected)
- **`develop`** - Development integration (protected)
- **`feat/feature-name`** - New features
- **`fix/bug-description`** - Bug fixes
- **`docs/update-description`** - Documentation
- **`refactor/component-name`** - Code refactoring
- **`chore/maintenance-task`** - Maintenance
- **`hotfix/critical-issue`** - Emergency fixes

### Branch Naming

```bash
# Feature branches
git checkout -b feat/booking-calendar-component
git checkout -b feat/payment-integration-stripe

# Bug fix branches
git checkout -b fix/timezone-calculation-error
git checkout -b fix/memory-leak-in-worker-service

# Documentation branches
git checkout -b docs/api-documentation-update
git checkout -b docs/deployment-guide

# Maintenance branches
git checkout -b chore/dependency-updates
git checkout -b chore/cleanup-unused-imports
```

## 🔄 Development Workflow

### 1. Starting New Work

```bash
# Always start from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feat/your-feature-name

# Verify you're on the right branch
git branch --show-current
```

### 2. Making Changes

```bash
# Stage changes
git add .

# Commit with conventional format
git commit -m "feat(scope): Description of changes"

# Push to remote
git push origin feat/your-feature-name
```

### 3. Creating Pull Requests

```bash
# Using GitHub CLI (recommended)
gh pr create \
  --title "feat(booking): Add real-time availability checking" \
  --body "Description of changes, testing notes, etc." \
  --label "enhancement" \
  --reviewer @team-member

# Or push and create PR via GitHub web interface
git push origin feat/your-feature-name
```

### 4. Updating Feature Branch

```bash
# Keep your branch up to date with develop
git checkout develop
git pull origin develop
git checkout feat/your-feature-name
git rebase develop

# Or use merge if rebase is complex
git merge develop
```

## 🛡️ Quality Gates

### Pre-commit (Automatic)

- **ESLint**: Code linting with zero warnings policy
- **Prettier**: Code formatting
- **Type Check**: TypeScript compilation
- **Commit Message**: Conventional commits validation

### CI Pipeline (GitHub Actions)

- **Lint**: ESLint and Prettier checks
- **Type Check**: TypeScript compilation
- **Tests**: Unit and integration tests
- **Build**: Verify all apps and services build
- **Security**: Dependency vulnerability scanning

### Pre-merge (Branch Protection)

- **Required Reviews**: 1-2 approvals depending on branch
- **Status Checks**: All CI checks must pass
- **Up-to-date**: Branch must be current with target
- **Conversation Resolution**: All comments resolved

## 🔧 Git Commands Reference

### Daily Commands

```bash
# Check status
git status
git log --oneline -10

# Branch management
git branch -a                    # List all branches
git checkout -b new-branch       # Create and switch
git branch -d feature-branch     # Delete local branch
git push origin --delete branch  # Delete remote branch

# Staging and commits
git add .                        # Stage all changes
git add -p                       # Interactive staging
git commit --amend              # Amend last commit
git reset --soft HEAD~1         # Undo last commit, keep changes

# Remote operations
git fetch origin                 # Fetch remote changes
git pull origin develop          # Pull and merge
git push origin feature-branch   # Push branch
git push -u origin feature-branch # Push and set upstream
```

### Advanced Commands

```bash
# Rebase operations
git rebase develop               # Rebase on develop
git rebase -i HEAD~3            # Interactive rebase last 3 commits
git rebase --continue           # Continue after resolving conflicts
git rebase --abort              # Abort rebase

# Stash operations
git stash                       # Stash changes
git stash pop                   # Apply and remove stash
git stash list                  # List stashes
git stash apply stash@{0}       # Apply specific stash

# Search and history
git log --grep="booking"        # Search commit messages
git log --author="John"         # Commits by author
git log --since="2 weeks ago"   # Recent commits
git blame filename              # See who changed what
```

## 🚨 Troubleshooting

### Common Issues

#### Commit Message Rejected

```bash
# Error: Commit message doesn't follow conventional format
# Fix: Use proper format
git commit --amend -m "feat(booking): Add availability checking"
```

#### Pre-commit Hook Fails

```bash
# Error: ESLint or Prettier issues
# Fix: Run linting manually
pnpm lint:fix
pnpm format

# Then commit again
git add .
git commit -m "fix(linting): Resolve code style issues"
```

#### Merge Conflicts

```bash
# 1. Pull latest changes
git pull origin develop

# 2. Resolve conflicts in editor
# 3. Mark as resolved
git add conflicted-file.ts

# 4. Complete merge
git commit -m "fix: Resolve merge conflicts with develop"
```

#### Branch Out of Sync

```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout your-branch
git rebase develop

# If rebase has conflicts, resolve them and continue
git add .
git rebase --continue
```

### Emergency Procedures

#### Accidental Commit to Wrong Branch

```bash
# Move commit to correct branch
git log --oneline -5             # Note the commit hash
git reset --hard HEAD~1          # Remove from current branch
git checkout correct-branch      # Switch to correct branch
git cherry-pick COMMIT_HASH      # Apply commit to correct branch
```

#### Need to Undo Last Commit

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Remove changes completely
git reset --hard HEAD~1

# Undo pushed commit (creates new commit)
git revert HEAD
```

## 📊 Git Hooks Details

### Pre-commit Hook (`.husky/pre-commit`)

```bash
#!/usr/bin/env sh
echo "🔍 Running pre-commit checks..."
pnpm lint-staged
echo "✅ Pre-commit checks passed!"
```

### Commit Message Hook (`.husky/commit-msg`)

```bash
#!/usr/bin/env sh
echo "🔍 Validating commit message..."
pnpm exec commitlint --edit "$1"
echo "✅ Commit message is valid!"
```

### Lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
    "*.{json,md,yaml,yml,css,scss,html}": ["prettier --write"],
    "*.{ts,tsx}": [
      "bash -c 'pnpm type-check || echo \"Type check failed but continuing...\"'"
    ]
  }
}
```

## 📚 Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Branch Protection Rules](./BRANCH_PROTECTION.md)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Best Practices](https://git-scm.com/docs/gitworkflows)
- [Semantic Versioning](https://semver.org/)

## 🎓 Tips for Success

### For New Team Members

1. **Read the docs first** - Understand the workflow before starting
2. **Start small** - Make small commits with clear messages
3. **Ask for help** - Don't struggle alone with git issues
4. **Use the tools** - Leverage GitHub CLI, VS Code git integration
5. **Review others' PRs** - Learn from how others structure commits

### For All Developers

1. **Commit often** - Small, focused commits are better than large ones
2. **Write clear messages** - Future you will thank present you
3. **Keep branches focused** - One feature/fix per branch
4. **Test before pushing** - Run tests and linting locally
5. **Stay up to date** - Regularly sync with develop branch

---

**Remember**: Good git practices make everyone's life easier. When in doubt, ask for help!
